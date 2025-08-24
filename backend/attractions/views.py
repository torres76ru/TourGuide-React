import os
import requests
import time
from io import BytesIO
from PIL import Image
from requests.exceptions import RequestException
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from .models import Attraction, AttractionPhoto, PendingAttractionUpdate
from cities.models import City
from .serializers import AttractionListSerializer, AttractionDetailSerializer, AttractionPhotoSerializer
from django.conf import settings
from django.db.models import Q
import re

class MapAttractionsView(APIView):
    def get_address_from_coordinates(self, lat, lng):
        try:
            nominatim_url = "https://nominatim.openstreetmap.org/reverse"
            params = {
                "lat": lat,
                "lon": lng,
                "format": "json",
                "addressdetails": 1,
            }
            headers = {"User-Agent": "TravelAPI/1.0"}
            response = requests.get(nominatim_url, params=params, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            address = data.get("display_name", "Unknown")
            city_name = (data.get("address", {}).get("city") or
                         data.get("address", {}).get("town") or
                         data.get("address", {}).get("village") or "Unknown")
            return {"address": address, "city_name": city_name}
        except Exception as e:
            print(f"Error fetching address from Nominatim: {str(e)}")
            return {"address": "Unknown", "city_name": "Unknown"}

    def get_wikipedia_description(self, wikipedia_page):
        cache_key = f"wikipedia_description_{wikipedia_page}"
        cached_description = cache.get(cache_key)
        if cached_description:
            return cached_description

        try:
            wp_url = f"https://ru.wikipedia.org/w/api.php?action=query&titles={wikipedia_page}&prop=extracts&exintro&explaintext&format=json"
            headers = {"User-Agent": "TravelAPI/1.0"}
            response = requests.get(wp_url, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            pages = data.get('query', {}).get('pages', {})
            for page in pages.values():
                description = page.get('extract', '')
                if description:
                    cache.set(cache_key, description, timeout=3600 * 24)
                    return description[:500]
            return None
        except Exception as e:
            print(f"Error fetching Wikipedia description for {wikipedia_page}: {str(e)}")
            return None

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius', 0.01)
        tags = request.query_params.get('tags', 'all').split(',')
        name_filter = request.query_params.get('name')

        if not lat or not lng:
            return Response({"error": "Latitude and longitude are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)
            radius = float(radius)

            if radius < 0.001 or radius > 0.01:
                return Response({"error": "Radius must be between 0.001 and 0.01"}, status=status.HTTP_400_BAD_REQUEST)

            cache_key = f"attractions_{lat}_{lng}_{radius}_{','.join(tags)}_{name_filter or ''}"
            cached_data = cache.get(cache_key)
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            address_data = self.get_address_from_coordinates(lat, lng)
            city_name = address_data["city_name"]

            lat_min = lat - radius
            lat_max = lat + radius
            lng_min = lng - radius
            lng_max = lng + radius

            overpass_url = "https://overpass-api.de/api/interpreter"
            overpass_query = "[out:json][timeout:25];(\n"

            if 'all' in tags or not any(tag.strip() for tag in tags):
                print("Using all tags by default")
                tag_groups = {
                    'historic': ['memorial', 'archaeological_site', 'monument'],
                    'tourism': ['museum', 'attraction', 'zoo'],
                    'leisure': ['park', 'garden'],
                    'amenity': ['theatre', 'cinema', 'library', 'restaurant', 'cafe'],
                }
            else:
                print(f"Using filtered tags: {tags}")
                tag_groups = {}
                tag_mapping = {
                    'park': 'leisure', 'garden': 'leisure', 'museum': 'tourism', 'attraction': 'tourism',
                    'place_of_worship': 'amenity', 'christian': 'religion', 'muslim': 'religion',
                    'theatre': 'amenity', 'cinema': 'amenity', 'library': 'amenity',
                    'restaurant': 'amenity', 'cafe': 'amenity', 'monument': 'historic',
                    'zoo': 'tourism',
                }
                for tag in tags:
                    tag = tag.strip()
                    if tag in tag_mapping:
                        key = tag_mapping[tag]
                        if key not in tag_groups:
                            tag_groups[key] = []
                        tag_groups[key].append(tag)
                print(f"Tag groups: {tag_groups}")

            for tag_key, tag_values in tag_groups.items():
                if tag_values:
                    if len(tag_values) > 1:
                        tag_filter = f'["{tag_key}"~"{("|").join(tag_values)}"]'
                    else:
                        tag_filter = f'["{tag_key}"="{tag_values[0]}"]'
                    if tag_key == 'amenity' and 'place_of_worship' in tag_values:
                        religion_values = tag_groups.get('religion', [])
                        if religion_values:
                            tag_filter = f'["amenity"="place_of_worship" "religion"~"{("|").join(religion_values)}"]'
                    if name_filter:
                        tag_filter += f'["name"~"{name_filter}",i]'
                    overpass_query += f"  node{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"
                    overpass_query += f"  way{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"
                    overpass_query += f"  relation{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"

            overpass_query += "); out 100; >; out skel qt;"
            print(f"Overpass Query: {overpass_query}")

            max_retries = 3
            osm_response = None
            for attempt in range(max_retries):
                try:
                    osm_response = requests.post(
                        overpass_url,
                        data={"data": overpass_query},
                        headers={"User-Agent": "TravelAPI/1.0"},
                        timeout=30
                    )
                    print(f"Overpass API Response Status: {osm_response.status_code}")
                    print(f"Response Text: {osm_response.text}")

                    if osm_response.status_code == 200:
                        break
                    elif osm_response.status_code == 504:
                        if attempt < max_retries - 1:
                            time.sleep(2 ** attempt)
                            continue
                        return Response({
                            "city": city_name,
                            "error": "Overpass API timed out after multiple attempts"
                        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                    else:
                        return Response({
                            "city": city_name,
                            "error": f"Overpass API error: {osm_response.status_code}, {osm_response.text}"
                        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                except RequestException as e:
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)
                        continue
                    return Response({
                        "city": city_name,
                        "error": f"Failed to connect to Overpass API: {str(e)}"
                    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            osm_data = osm_response.json()
            attractions = []

            for element in osm_data.get('elements', []):
                if 'lat' in element and 'lon' in element:
                    name = element.get('tags', {}).get('name', 'Unknown_Place')
                    if name == 'Unknown_Place':
                        continue
                    lat = element['lat']
                    lng = element['lon']
                    tags = element.get('tags', {})
                    relevant_tags = {k: v for k, v in tags.items() if
                                    k in ['tourism', 'historic', 'leisure', 'natural', 'piste:type', 'aerialway',
                                          'shop', 'amenity', 'building', 'religion', 'place', 'highway',
                                          'wikipedia', 'wikidata', 'description']}
                    address_data = self.get_address_from_coordinates(lat, lng)
                    city_name = address_data["city_name"]
                    address = address_data["address"]
                    description = tags.get('description')
                    if not description and 'wikipedia' in tags:
                        wp_page = tags['wikipedia'].split(':', 1)[-1]
                        description = self.get_wikipedia_description(wp_page)

                    if city_name and city_name != "Unknown":
                        city, _ = City.objects.get_or_create(name=city_name)
                    else:
                        city = None

                    attraction, created = Attraction.objects.get_or_create(
                        name=name,
                        latitude=lat,
                        longitude=lng,
                        defaults={
                            'tags': relevant_tags if relevant_tags else None,
                            'city': city,
                            'address': address,
                            'description': description,
                            'description_short': description[:255] if description else None  # Добавляем description_short
                        }
                    )
                    if created:
                        attraction.need_photo = True
                        attraction.save()
                    elif not created and (
                            attraction.tags != relevant_tags or
                            attraction.city != city or
                            attraction.address != address or
                            attraction.description != description or
                            attraction.description_short != (description[:255] if description else None)):
                        attraction.tags = relevant_tags
                        attraction.city = city
                        attraction.address = address
                        attraction.description = description
                        attraction.description_short = description[:255] if description else None
                        attraction.save()
                    if not attraction.main_photo:
                        attraction.need_photo = True
                        attraction.save()
                    attractions.append(attraction)
                elif 'center' in element:
                    name = element.get('tags', {}).get('name', 'Unknown_Place')
                    if name == 'Unknown_Place':
                        continue
                    center = element['center']
                    lat = center['lat']
                    lng = center['lon']
                    tags = element.get('tags', {})
                    relevant_tags = {k: v for k, v in tags.items() if
                                    k in ['tourism', 'historic', 'leisure', 'natural', 'piste:type', 'aerialway',
                                          'shop', 'amenity', 'building', 'religion', 'place', 'highway',
                                          'wikipedia', 'wikidata', 'description']}
                    address_data = self.get_address_from_coordinates(lat, lng)
                    city_name = address_data["city_name"]
                    address = address_data["address"]
                    description = tags.get('description')
                    if not description and 'wikipedia' in tags:
                        wp_page = tags['wikipedia'].split(':', 1)[-1]
                        description = self.get_wikipedia_description(wp_page)

                    if city_name and city_name != "Unknown":
                        city, _ = City.objects.get_or_create(name=city_name)
                    else:
                        city = None

                    attraction, created = Attraction.objects.get_or_create(
                        name=name,
                        latitude=lat,
                        longitude=lng,
                        defaults={
                            'tags': relevant_tags if relevant_tags else None,
                            'city': city,
                            'address': address,
                            'description': description,
                            'description_short': description[:255] if description else None  # Добавляем description_short
                        }
                    )
                    if created:
                        attraction.need_photo = True
                        attraction.save()
                    elif not created and (
                            attraction.tags != relevant_tags or
                            attraction.city != city or
                            attraction.address != address or
                            attraction.description != description or
                            attraction.description_short != (description[:255] if description else None)):
                        attraction.tags = relevant_tags
                        attraction.city = city
                        attraction.address = address
                        attraction.description = description
                        attraction.description_short = description[:255] if description else None
                        attraction.save()
                    if not attraction.main_photo:
                        attraction.need_photo = True
                        attraction.save()
                    attractions.append(attraction)

            if attractions:
                attractions = Attraction.objects.filter(
                    id__in=[a.id for a in attractions]
                ).prefetch_related('ratings')
                serializer = AttractionListSerializer(attractions, many=True)
                response_data = {
                    "city": city_name,
                    "attractions": serializer.data
                }
                cache.set(cache_key, response_data, timeout=3600)
                return Response(response_data, status=status.HTTP_200_OK)

            return Response({
                "city": city_name,
                "attractions": [],
                "error": "No attractions found in the area"
            }, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({"error": "Invalid latitude, longitude, or radius"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminListPendingPhotosView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_attractions = Attraction.objects.filter(
            need_photo=True,
            admin_reviewed=False
        )
        serializer = AttractionListSerializer(pending_attractions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminFetchPhotosView(APIView):
    permission_classes = [IsAdminUser]

    def compress_image(self, image_content, target_size_kb=100):
        img = Image.open(BytesIO(image_content))
        if img.mode != 'RGB':
            img = img.convert('RGB')

        quality = 85
        max_size = max(img.size)
        output = BytesIO()

        while True:
            output.seek(0)
            output.truncate(0)
            img.save(output, format='JPEG', quality=quality, optimize=True)
            size_kb = len(output.getvalue()) / 1024

            if size_kb <= target_size_kb or quality <= 10:
                break

            if max_size > 1000:
                scale = 0.8
                new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                max_size = max(new_size)
            else:
                quality -= 10

        return output.getvalue()

    def put(self, request):
        pending_attractions = Attraction.objects.filter(
            need_photo=True,
            admin_reviewed=False
        )
        updated_ids = []

        for attraction in pending_attractions:
            image_url = self._fetch_and_save_image(attraction.name, attraction.tags, attraction.id, attraction.address)
            if image_url:
                if image_url.startswith(settings.MEDIA_URL):
                    relative_path = image_url[len(settings.MEDIA_URL):]
                    file_name = f"mainphoto/{attraction.id}.{relative_path.split('.')[-1]}"
                    attraction.main_photo = relative_path
                    attraction.need_photo = False
                    attraction.save()
                    updated_ids.append(attraction.id)
                else:
                    try:
                        response = requests.get(image_url, headers={"User-Agent": "TravelAPI/1.0"})
                        if response.status_code == 200:
                            compressed_image = self.compress_image(response.content)
                            file_name = f"mainphoto/{attraction.id}.jpg"
                            attraction.main_photo.save(
                                file_name,
                                ContentFile(compressed_image),
                                save=True
                            )
                            attraction.need_photo = False
                            attraction.save()
                            updated_ids.append(attraction.id)
                    except requests.exceptions.RequestException as e:
                        print(f"Error downloading image for {attraction.name}: {str(e)}")
                        continue

        return Response({"updated_ids": updated_ids, "count": len(updated_ids)}, status=status.HTTP_200_OK)

    def _fetch_and_save_image(self, place_name, tags, attraction_id, address=None):
        if place_name == 'Unknown_Place':
            return None

        sanitized_name = ''.join(c if c.isalnum() or c == '_' else '_' for c in place_name)
        sanitized_name = sanitized_name.replace('__', '_').strip('_')
        if not sanitized_name:
            sanitized_name = 'unnamed_attraction'

        image_path = os.path.join(settings.MEDIA_ROOT, f"mainphoto/{attraction_id}.jpg")
        if os.path.exists(image_path):
            if os.path.getsize(image_path) / 1024 <= 100:
                return f"{settings.MEDIA_URL}mainphoto/{attraction_id}.jpg"
            else:
                os.remove(image_path)

        headers = {"User-Agent": "TravelAPI/1.0"}
        image_url = None

        wikidata_id = tags.get('wikidata')
        if wikidata_id:
            try:
                wd_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={wikidata_id}&props=claims&format=json"
                wd_response = requests.get(wd_url, headers=headers, timeout=10)
                if wd_response.status_code == 200:
                    wd_data = wd_response.json()
                    entities = wd_data.get('entities', {}).get(wikidata_id, {})
                    claims = entities.get('claims', {})
                    image_prop = claims.get('P18', [])
                    if image_prop:
                        image_name = image_prop[0].get('mainsnak', {}).get('datavalue', {}).get('value')
                        if image_name:
                            image_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{image_name}"
            except Exception as e:
                print(f"Error fetching Wikidata for {place_name}: {e}")

        if not image_url and 'wikipedia' in tags:
            wp_page = tags['wikipedia'].split(':', 1)[-1]
            wp_url = f"https://ru.wikipedia.org/w/api.php?action=query&titles={wp_page}&prop=pageimages|categories|extracts&format=json&piprop=original&exintro=1&explaintext=1"
            try:
                wp_response = requests.get(wp_url, headers=headers, timeout=10)
                if wp_response.status_code == 200:
                    wp_data = wp_response.json()
                    pages = wp_data.get('query', {}).get('pages', {})
                    for page in pages.values():
                        if 'original' in page:
                            categories = page.get('categories', [])
                            is_relevant = any(
                                any(term in cat['title'].lower() for term in ['достопримечательность', 'памятник', 'музей', 'парк', 'храм'])
                                for cat in categories
                            )
                            if is_relevant and address:
                                extract_text = page.get('extract', '').lower()
                                address_parts = [part.strip().lower() for part in address.split(',') if part.strip()]
                                if any(part in extract_text for part in address_parts):
                                    image_url = page['original']['source']
                                    break
            except Exception as e:
                print(f"Error fetching Wikipedia page for {place_name}: {e}")

        if not image_url and address:
            search_terms = f"{place_name} {address} достопримечательность"
            search_url = f"https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch={search_terms}&format=json&srprop=snippet|titlesnippet"
            try:
                search_response = requests.get(search_url, headers=headers, timeout=10)
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    search_results = search_data.get('query', {}).get('search', [])
                    for result in search_results[:5]:
                        title = result['title']
                        wp_url = f"https://ru.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages|categories|extracts&format=json&piprop=original&exintro=1&explaintext=1"
                        wp_response = requests.get(wp_url, headers=headers, timeout=10)
                        if wp_response.status_code == 200:
                            wp_data = wp_response.json()
                            pages = wp_data.get('query', {}).get('pages', {})
                            for page in pages.values():
                                if 'original' in page:
                                    categories = page.get('categories', [])
                                    is_relevant = any(
                                        any(term in cat['title'].lower() for term in ['достопримечательность', 'памятник', 'музей', 'парк', 'храм'])
                                        for cat in categories
                                    )
                                    if is_relevant:
                                        extract_text = page.get('extract', '').lower()
                                        address_parts = [part.strip().lower() for part in address.split(',') if part.strip()]
                                        if len([part for part in address_parts if part in extract_text]) >= len(address_parts) // 2:
                                            image_url = page['original']['source']
                                            break
                            if image_url:
                                break
            except Exception as e:
                print(f"Error searching Wikipedia for {place_name} with address: {e}")

        if not image_url and address and hasattr(settings, 'GOOGLE_PLACES_API_KEY'):
            try:
                g_url = "https://places.googleapis.com/v1/places:searchText"
                g_headers = {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": settings.GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.photos"
                }
                g_payload = {
                    "textQuery": f"{place_name} {address}",
                    "languageCode": "ru"
                }

                if 'lat' in tags and 'lon' in tags:
                    g_payload["locationBias"] = {
                        "circle": {
                            "center": {"latitude": float(tags['lat']), "longitude": float(tags['lon'])},
                            "radius": 1000.0
                        }
                    }

                g_response = requests.post(g_url, headers=g_headers, json=g_payload)
                if g_response.status_code == 200:
                    g_data = g_response.json()
                    for place in g_data.get("places", []):
                        photos = place.get("photos", [])
                        if photos:
                            photo_name = photos[0]["name"]
                            photo_url = f"https://places.googleapis.com/v1/{photo_name}/media?maxHeightPx=800&key={settings.GOOGLE_PLACES_API_KEY}"
                            image_url = photo_url
                            break
            except Exception as e:
                print(f"Error fetching Google Places for {place_name}: {e}")

        if image_url:
            try:
                image_response = requests.get(image_url, headers=headers, stream=True, timeout=10)
                if image_response.status_code == 200:
                    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'mainphoto'), exist_ok=True)
                    img = Image.open(BytesIO(image_response.content))
                    if img.size[0] < 200 or img.size[1] < 200:
                        return None
                    compressed_image = self.compress_image(image_response.content)
                    with open(image_path, 'wb') as f:
                        f.write(compressed_image)
                    return f"{settings.MEDIA_URL}mainphoto/{attraction_id}.jpg"
            except Exception as e:
                print(f"Error saving image for {place_name}: {e}")
                return None

        return None

class AttractionListView(generics.ListAPIView):
    queryset = Attraction.objects.all()
    serializer_class = AttractionListSerializer

class AttractionDetailView(generics.RetrieveAPIView):
    queryset = Attraction.objects.all()
    serializer_class = AttractionDetailSerializer

class AttractionCreateView(generics.CreateAPIView):
    serializer_class = AttractionDetailSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        required_fields = ['name', 'category', 'description', 'address']
        for field in required_fields:
            if not validated_data.get(field):
                raise ValidationError(f"{field} является обязательным.")

        city = None
        if 'city' in validated_data and validated_data['city']:
            city_name = validated_data['city']
            city, _ = City.objects.get_or_create(name=city_name)
        elif 'latitude' in validated_data or 'longitude' in validated_data:
            view = MapAttractionsView()
            address_data = view.get_address_from_coordinates(
                validated_data.get('latitude'),
                validated_data.get('longitude')
            )
            city_name = address_data["city_name"]
            if city_name != "Unknown":
                city, _ = City.objects.get_or_create(name=city_name)
            if 'address' not in validated_data or not validated_data.get('address'):
                validated_data['address'] = address_data["address"]

        if 'description' not in validated_data or not validated_data.get('description'):
            view = MapAttractionsView()
            wp_description = view.get_wikipedia_description(validated_data['name'].replace(' ', '_'))
            if wp_description:
                validated_data['description'] = wp_description
                validated_data['description_short'] = wp_description[:255] if wp_description else None

        if 'category' not in validated_data or not validated_data.get('category'):
            name = validated_data.get('name', '').lower()
            if 'музей' in name:
                validated_data['category'] = 'Музей'
            elif 'парк' in name:
                validated_data['category'] = 'Парк'
            else:
                validated_data['category'] = 'Достопримечательность'

        pending_update = PendingAttractionUpdate.objects.create(
            attraction=None,
            user=request.user,
            name=validated_data.get('name'),
            category=validated_data.get('category'),
            description=validated_data.get('description'),
            description_short=validated_data.get('description_short'),  # Добавляем description_short
            working_hours=validated_data.get('working_hours'),
            phone_number=validated_data.get('phone_number'),
            email=validated_data.get('email'),
            website=validated_data.get('website'),
            cost=validated_data.get('cost'),
            average_check=validated_data.get('average_check'),
            address=validated_data.get('address'),
            latitude=validated_data.get('latitude'),
            longitude=validated_data.get('longitude'),
            city=city,
            tags=validated_data.get('tags', {}),
            status='pending'
        )

        return Response({
            "message": "New attraction submitted for admin approval.",
            "pending_update_id": pending_update.id
        }, status=status.HTTP_202_ACCEPTED)

class PhotoUploadView(generics.CreateAPIView):
    queryset = AttractionPhoto.objects.all()
    serializer_class = AttractionPhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        attraction_id = kwargs.get('attraction_id')
        attraction = get_object_or_404(Attraction, id=attraction_id)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(attraction=attraction, user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AttractionSearchView(APIView):
    def post(self, request):
        name = request.data.get('name', '')

        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if len(name) < 3:
            return Response({"error": "Name must be at least 3 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cache_key = f"attraction_search_{name.lower()}"
            cached_attractions = cache.get(cache_key)
            if cached_attractions:
                return Response(cached_attractions, status=status.HTTP_200_OK)

            query_normalized = re.sub(r'\s+', '', name.lower())
            attractions = Attraction.objects.filter(
                name__iregex=r'.*' + re.escape(query_normalized) + r'.*'
            ).distinct()

            if not attractions.exists():
                attractions = Attraction.objects.filter(name__icontains=name).distinct()

            if not attractions.exists():
                return Response({"error": "No attractions found matching the query"}, status=status.HTTP_404_NOT_FOUND)

            print(f"Found {attractions.count()} attractions for query '{name}'")
            serializer = AttractionListSerializer(attractions, many=True)
            response_data = serializer.data
            print(f"Serialized data length: {len(response_data)}")
            cache.set(cache_key, response_data, timeout=3600)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttractionDetailCitiesView(APIView):
    def get_address_from_coordinates(self, lat, lng):
        try:
            nominatim_url = "https://nominatim.openstreetmap.org/reverse"
            params = {
                "lat": lat,
                "lon": lng,
                "format": "json",
                "addressdetails": 1,
            }
            headers = {"User-Agent": "TravelAPI/1.0"}
            response = requests.get(nominatim_url, params=params, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            city_name = (
                data.get("address", {}).get("city")
                or data.get("address", {}).get("town")
                or data.get("address", {}).get("village")
                or "Unknown"
            )
            return city_name
        except Exception as e:
            print(f"Error fetching address from Nominatim: {str(e)}")
            return "Unknown"

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')

        if not lat or not lng:
            return Response({"error": "Latitude and longitude are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)

            cache_key = f"city_location_{lat}_{lng}"
            cached_city = cache.get(cache_key)
            if cached_city:
                return Response({"city": cached_city}, status=status.HTTP_200_OK)

            city_name = self.get_address_from_coordinates(lat, lng)

            if city_name == "Unknown":
                return Response({"error": "City not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                city = City.objects.get(name=city_name)
            except City.DoesNotExist:
                return Response({"error": "City not found in database"}, status=status.HTTP_404_NOT_FOUND)

            cache.set(cache_key, city_name, timeout=3600)

            return Response({"city": city_name}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid latitude or longitude"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttractionUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Attraction.objects.all()
    serializer_class = AttractionDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        instance = serializer.instance
        validated_data = serializer.validated_data

        restricted_fields = ['average_rating', 'rating_count', 'created_at', 'main_photo', 'need_photo', 'admin_reviewed']
        for field in restricted_fields:
            if field in validated_data:
                raise ValidationError({field: f"Поле {field} не может быть обновлено."})

        current_data = {
            'name': instance.name,
            'category': instance.category,
            'description': instance.description,
            'description_short': instance.description_short,  # Добавляем description_short
            'working_hours': instance.working_hours,
            'phone_number': instance.phone_number,
            'email': instance.email,
            'website': instance.website,
            'cost': instance.cost,
            'average_check': instance.average_check,
            'address': instance.address,
            'latitude': instance.latitude,
            'longitude': instance.longitude,
            'city': instance.city.name if instance.city else None,
            'tags': instance.tags
        }

        view = MapAttractionsView()

        city = instance.city
        if 'city' in validated_data and validated_data['city'] != current_data['city']:
            city_name = validated_data['city']
            city, _ = City.objects.get_or_create(name=city_name)

        if 'latitude' in validated_data or 'longitude' in validated_data:
            new_latitude = validated_data.get('latitude', current_data['latitude'])
            new_longitude = validated_data.get('longitude', current_data['longitude'])
            if new_latitude != current_data['latitude'] or new_longitude != current_data['longitude']:
                address_data = view.get_address_from_coordinates(new_latitude, new_longitude)
                city_name = address_data["city_name"]
                if city_name != "Unknown" and ('city' not in validated_data or not validated_data.get('city')):
                    city, _ = City.objects.get_or_create(name=city_name)
                if 'address' not in validated_data or not validated_data.get('address'):
                    validated_data['address'] = address_data["address"]

        if 'name' in validated_data and validated_data['name'] != current_data['name']:
            name = validated_data['name']
            if 'description' not in validated_data or not validated_data.get('description'):
                wp_description = view.get_wikipedia_description(name.replace(' ', '_'))
                if wp_description:
                    validated_data['description'] = wp_description
                    validated_data['description_short'] = wp_description[:255] if wp_description else None

        pending_update = PendingAttractionUpdate.objects.create(
            attraction=instance,
            user=self.request.user,
            name=validated_data.get('name', instance.name),
            category=validated_data.get('category', instance.category),
            description=validated_data.get('description', instance.description),
            description_short=validated_data.get('description_short', instance.description_short),  # Добавляем description_short
            working_hours=validated_data.get('working_hours', instance.working_hours),
            phone_number=validated_data.get('phone_number', instance.phone_number),
            email=validated_data.get('email', instance.email),
            website=validated_data.get('website', instance.website),
            cost=validated_data.get('cost', instance.cost),
            average_check=validated_data.get('average_check', instance.average_check),
            address=validated_data.get('address', instance.address),
            latitude=validated_data.get('latitude', instance.latitude),
            longitude=validated_data.get('longitude', instance.longitude),
            city=city,
            tags=validated_data.get('tags', instance.tags),
            status='pending'
        )

        return Response({
            "message": "Changes submitted for admin approval.",
            "pending_update_id": pending_update.id
        }, status=status.HTTP_202_ACCEPTED)