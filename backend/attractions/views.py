import os
import re
import requests
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
from attractions_map.views import MapAttractionsView

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
        city_name = validated_data.get('city')
        if city_name:

            if isinstance(city_name, str) and city_name.startswith('{'):
                try:
                    city_data = json.loads(city_name)
                    city_name = city_data.get('name')
                except json.JSONDecodeError:
                    raise ValidationError("Некорректный формат поля city.")
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
            description_short=validated_data.get('description_short'),
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
            print(f"Processing query: {name}")
            cache_key = f"attraction_search_{name.lower()}"
            cached_attractions = cache.get(cache_key)
            if cached_attractions:
                print(f"Returning cached data for {cache_key}")
                return Response(cached_attractions, status=status.HTTP_200_OK)

            query_words = [word for word in re.split(r'\s+', name.lower()) if word]
            print(f"Query words: {query_words}")

            query = Q()
            for word in query_words:
                query &= Q(name__icontains=word)

            print("Performing search with Q query")
            attractions = Attraction.objects.filter(query).distinct()

            if not attractions.exists():
                print("Falling back to icontains search for original query")
                attractions = Attraction.objects.filter(name__icontains=name).distinct()

            if not attractions.exists():
                response_data = {"warning": f"No attractions found matching the query '{name}'"}
                print(f"No attractions found for query '{name}'")
                cache.set(cache_key, response_data, timeout=3600)
                return Response(response_data, status=status.HTTP_200_OK)

            print(f"Found {attractions.count()} attractions for query '{name}'")
            serializer = AttractionListSerializer(attractions, many=True)
            response_data = serializer.data
            print(f"Serialized data: {response_data}")
            cache.set(cache_key, response_data, timeout=3600)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            import traceback
            traceback.print_exc()
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
            'description_short': instance.description_short,
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
            description_short=validated_data.get('description_short', instance.description_short),
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