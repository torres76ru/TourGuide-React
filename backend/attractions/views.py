import os
import requests
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
from .models import Attraction, AttractionPhoto
from .serializers import AttractionListSerializer, AttractionDetailSerializer, AttractionPhotoSerializer
from django.conf import settings

class MapAttractionsView(APIView):
    def get_city_from_coordinates(self, lat, lng):
        try:
            nominatim_url = "https://nominatim.openstreetmap.org/reverse"
            params = {
                "lat": lat,
                "lon": lng,
                "format": "json",
            }
            headers = {"User-Agent": "TravelAPI/1.0"}
            response = requests.get(nominatim_url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()
                address = data.get("address", {})
                city = address.get("city") or address.get("town") or address.get("village") or "Unknown"
                return city
            else:
                print(f"Nominatim API error: {response.status_code}, {response.text}")
                return "Unknown"
        except Exception as e:
            print(f"Error fetching city from Nominatim: {str(e)}")
            return "Unknown"

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius', 0.01)  # Радиус по умолчанию ~1 км
        tags = request.query_params.get('tags', 'all').split(',')

        if not lat or not lng:
            return Response({"error": "Latitude and longitude are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)
            radius = float(radius)

            # Валидация радиуса: от 0.001 до 0.01
            if radius < 0.001 or radius > 0.01:
                return Response({"error": "Radius must be between 0.001 and 0.01"}, status=status.HTTP_400_BAD_REQUEST)

            # Получаем город по координатам
            city = self.get_city_from_coordinates(lat, lng)

            lat_min = lat - radius
            lat_max = lat + radius
            lng_min = lng - radius
            lng_max = lng + radius

            overpass_url = "https://overpass-api.de/api/interpreter"
            overpass_query = "[out:json];(\n"

            if 'all' in tags or not any(tag.strip() for tag in tags):
                print("Using all tags by default")
                tag_groups = {
                    'historic': ['memorial', 'archaeological_site'],
                    'tourism': ['museum', 'attraction'],
                    'leisure': ['park', 'garden'],
                    'amenity': ['place_of_worship'],
                }
            else:
                print(f"Using filtered tags: {tags}")
                tag_groups = {}
                tag_mapping = {
                    'park': 'leisure', 'museum': 'tourism', 'garden': 'leisure', 'attraction': 'tourism',
                    'place_of_worship': 'amenity', 'christian': 'religion', 'muslim': 'religion'
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
                    overpass_query += f"  node{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"
                    overpass_query += f"  way{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"
                    overpass_query += f"  relation{tag_filter}({lat_min}, {lng_min}, {lat_max}, {lng_max});\n"

            overpass_query += "); out body; >; out skel qt;"
            print(f"Overpass Query: {overpass_query}")

            osm_response = requests.post(overpass_url, data={"data": overpass_query},
                                        headers={"User-Agent": "TravelAPI/1.0"})
            print(f"Overpass API Response Status: {osm_response.status_code}")
            print(f"Response Text: {osm_response.text}")

            if osm_response.status_code == 200:
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
                                              'shop', 'amenity', 'building', 'religion', 'place', 'highway', 'wikipedia', 'wikidata']}
                        city = self.get_city_from_coordinates(lat, lng)
                        attraction, created = Attraction.objects.get_or_create(
                            name=name,
                            latitude=lat,
                            longitude=lng,
                            defaults={
                                'tags': relevant_tags if relevant_tags else None,
                                'city': city
                            }
                        )
                        if created:
                            attraction.need_photo = True
                            attraction.save()
                        elif not created and (attraction.tags != relevant_tags or not attraction.city):
                            attraction.tags = relevant_tags
                            attraction.city = city
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
                                              'shop', 'amenity', 'building', 'religion', 'place', 'highway', 'wikipedia', 'wikidata']}
                        city = self.get_city_from_coordinates(lat, lng)
                        attraction, created = Attraction.objects.get_or_create(
                            name=name,
                            latitude=lat,
                            longitude=lng,
                            defaults={
                                'tags': relevant_tags if relevant_tags else None,
                                'city': city
                            }
                        )
                        if created:
                            attraction.need_photo = True
                            attraction.save()
                        elif not created and (attraction.tags != relevant_tags or not attraction.city):
                            attraction.tags = relevant_tags
                            attraction.city = city
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
                    return Response({
                        "city": city,
                        "attractions": serializer.data
                    }, status=status.HTTP_200_OK)

                return Response({
                    "city": city,
                    "attractions": [],
                    "error": "No attractions found in the area"
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "city": city,
                "error": f"Could not fetch data from Overpass API. Status: {osm_response.status_code}, Text: {osm_response.text}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    def put(self, request):
        pending_attractions = Attraction.objects.filter(
            need_photo=True,
            admin_reviewed=False
        )
        updated_ids = []

        for attraction in pending_attractions:
            image_url = self._fetch_and_save_image(attraction.name, attraction.tags, attraction.id)
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
                            file_name = f"mainphoto/{attraction.id}.{image_url.split('.')[-1]}"
                            attraction.main_photo.save(
                                file_name,
                                ContentFile(response.content),
                                save=True
                            )
                            attraction.need_photo = False
                            attraction.save()
                            updated_ids.append(attraction.id)
                    except requests.exceptions.RequestException as e:
                        print(f"Error downloading image for {attraction.name}: {str(e)}")
                        continue

        return Response({"updated_ids": updated_ids, "count": len(updated_ids)}, status=status.HTTP_200_OK)

    def _fetch_and_save_image(self, place_name, tags, attraction_id):
        if place_name == 'Unknown_Place':
            return None

        sanitized_name = ''.join(c if c.isalnum() or c == '_' else '_' for c in place_name)
        sanitized_name = sanitized_name.replace('__', '_').strip('_')
        if not sanitized_name:
            sanitized_name = 'unnamed_attraction'

        image_path = os.path.join(settings.MEDIA_ROOT, f"mainphoto/{attraction_id}.jpg")
        if os.path.exists(image_path):
            return f"{settings.MEDIA_URL}mainphoto/{attraction_id}.jpg"

        headers = {"User-Agent": "TravelAPI/1.0"}
        image_url = None

        wikidata_id = tags.get('wikidata')
        if wikidata_id:
            try:
                wd_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={wikidata_id}&props=claims&format=json"
                wd_response = requests.get(wd_url, headers=headers)
                if wd_response.status_code == 200:
                    wd_data = wd_response.json()
                    claims = wd_data.get('entities', {}).get(wikidata_id, {}).get('claims', {})
                    image_prop = claims.get('P18', [])
                    if image_prop:
                        image_name = image_prop[0].get('mainsnak', {}).get('datavalue', {}).get('value')
                        image_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{image_name}"
            except Exception as e:
                print(f"Error fetching Wikidata for {place_name}: {e}")

        if not image_url and 'wikipedia' in tags:
            wp_page = tags['wikipedia'].split(':', 1)[-1]
            wp_url = f"https://ru.wikipedia.org/w/api.php?action=query&titles={wp_page}&prop=pageimages&format=json&piprop=original"
            try:
                wp_response = requests.get(wp_url, headers=headers)
                if wp_response.status_code == 200:
                    wp_data = wp_response.json()
                    pages = wp_data.get('query', {}).get('pages', {})
                    for page in pages.values():
                        if 'original' in page:
                            image_url = page['original']['source']
                            break
            except Exception as e:
                print(f"Error fetching Wikipedia for {place_name}: {e}")

        if not image_url:
            search_url = f"https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch={place_name} достопримечательность&format=json"
            try:
                search_response = requests.get(search_url, headers=headers)
                if search_response.status_code == 200:
                    search_data = search_response.json()
                    search_results = search_data.get('query', {}).get('search', [])
                    if search_results:
                        title = search_results[0]['title']
                        wp_url = f"https://ru.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&piprop=original"
                        wp_response = requests.get(wp_url, headers=headers)
                        if wp_response.status_code == 200:
                            wp_data = wp_response.json()
                            pages = wp_data.get('query', {}).get('pages', {})
                            for page in pages.values():
                                if 'original' in page:
                                    image_url = page['original']['source']
                                    break
            except Exception as e:
                print(f"Error searching Wikipedia for {place_name}: {e}")

        if image_url:
            try:
                image_response = requests.get(image_url, headers=headers)
                if image_response.status_code == 200:
                    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'mainphoto'), exist_ok=True)
                    with open(image_path, 'wb') as f:
                        f.write(image_response.content)
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
    queryset = Attraction.objects.all()
    serializer_class = AttractionDetailSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(need_photo=True)


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