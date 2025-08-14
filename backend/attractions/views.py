import requests
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Attraction
from .serializers import AttractionSerializer
from django.conf import settings

class MapAttractionsView(APIView):
    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius', 0.01)  # Радиус по умолчанию ~1-2 км
        tags = request.query_params.get('tags', 'all').split(',')

        if not lat or not lng:
            return Response({"error": "Latitude and longitude are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)
            radius = float(radius)

            lat_min = lat - radius
            lat_max = lat + radius
            lng_min = lng - radius
            lng_max = lng + radius

            overpass_url = "https://overpass-api.de/api/interpreter"
            overpass_query = "[out:json];(\n"

            # Определяем теги в зависимости от параметра tags
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

            osm_response = requests.post(overpass_url, data={"data": overpass_query}, headers={"User-Agent": "TravelAPI/1.0"})
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
                        relevant_tags = {k: v for k, v in tags.items() if k in ['tourism', 'historic', 'leisure', 'natural', 'piste:type', 'aerialway', 'shop', 'amenity', 'building', 'religion', 'place', 'highway']}
                        attraction, created = Attraction.objects.get_or_create(
                            name=name,
                            latitude=lat,
                            longitude=lng,
                            defaults={'image_url': None, 'tags': relevant_tags if relevant_tags else None}
                        )
                        if not created and attraction.tags != relevant_tags:
                            attraction.tags = relevant_tags
                            attraction.save()
                        #image_url = self._fetch_and_save_image(name, tags)
                       # if image_url and attraction.image_url != image_url:
                        #    attraction.image_url = image_url
                         #   attraction.save()
                        attractions.append(attraction)
                    elif 'center' in element:
                        name = element.get('tags', {}).get('name', 'Unknown_Place')
                        if name == 'Unknown_Place':
                            continue
                        center = element['center']
                        lat = center['lat']
                        lng = center['lon']
                        tags = element.get('tags', {})
                        relevant_tags = {k: v for k, v in tags.items() if k in ['tourism', 'historic', 'leisure', 'natural', 'piste:type', 'aerialway', 'shop', 'amenity', 'building', 'religion', 'place', 'highway']}
                        attraction, created = Attraction.objects.get_or_create(
                            name=name,
                            latitude=lat,
                            longitude=lng,
                            defaults={'image_url': None, 'tags': relevant_tags if relevant_tags else None}
                        )
                        if not created and attraction.tags != relevant_tags:
                            attraction.tags = relevant_tags
                            attraction.save()
                        #image_url = self._fetch_and_save_image(name)
                        #if image_url and attraction.image_url != image_url:
                        #    attraction.image_url = image_url
                         #   attraction.save()
                        attractions.append(attraction)

                if attractions:
                    attractions = Attraction.objects.filter(
                        id__in=[a.id for a in attractions]
                    ).prefetch_related('ratings')
                    serializer = AttractionSerializer(attractions, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)

                return Response({"error": "No attractions found in the area"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"error": f"Could not fetch data from Overpass API. Status: {osm_response.status_code}, Text: {osm_response.text}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ValueError:
            return Response({"error": "Invalid latitude, longitude, or radius"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _fetch_and_save_image(self, place_name, tags):
        """Извлекает одну картинку с Википедии или Wikidata и сохраняет её. Приоритет: Wikidata > Wikipedia tag > Поиск."""
        if place_name == 'Unknown_Place':
            return None

        sanitized_name = place_name.replace(' ', '_').replace('/', '_').replace('\\', '_')
        image_path = os.path.join(settings.MEDIA_ROOT, f"{sanitized_name}.jpg")

        if os.path.exists(image_path):
            return f"{settings.MEDIA_URL}{sanitized_name}.jpg"

        headers = {"User-Agent": "TravelAPI/1.0"}
        image_url = None


        if 'wikidata' in tags:
            wikidata_id = tags['wikidata']
            wd_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={wikidata_id}&props=claims&format=json"
            wd_response = requests.get(wd_url, headers=headers)
            if wd_response.status_code == 200:
                wd_data = wd_response.json()
                entity = wd_data.get('entities', {}).get(wikidata_id, {})
                claims = entity.get('claims', {})
                if 'P18' in claims:  # P18 — свойство основного изображения
                    image_file = claims['P18'][0]['mainsnak']['datavalue']['value']
                    commons_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{image_file}&prop=imageinfo&iiprop=url&format=json"
                    commons_response = requests.get(commons_url, headers=headers)
                    if commons_response.status_code == 200:
                        commons_data = commons_response.json()
                        pages = commons_data['query']['pages']
                        if pages:
                            image_info = list(pages.values())[0].get('imageinfo', [])
                            if image_info:
                                image_url = image_info[0]['url']


        if not image_url and 'wikipedia' in tags:
            wp_tag = tags['wikipedia']
            if ':' in wp_tag:
                lang, title = wp_tag.split(':', 1)
            else:
                lang = 'ru'
                title = wp_tag
            title = title.replace(' ', '_')
            wiki_base = f"https://{lang}.wikipedia.org/w/api.php"
            wp_url = f"{wiki_base}?action=query&titles={title}&prop=pageimages&format=json&piprop=original"
            wp_response = requests.get(wp_url, headers=headers)
            if wp_response.status_code == 200:
                wp_data = wp_response.json()
                pages = wp_data['query']['pages']
                if pages:
                    page = list(pages.values())[0]
                    if 'original' in page.get('thumbnail', {}):
                        image_url = page['original']['source']
                    elif 'thumbnail' in page:
                        image_url = page['thumbnail']['source']


        if not image_url:
            search_query = f"{place_name} достопримечательность"
            wiki_url = f"https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch={search_query}&format=json"
            wiki_response = requests.get(wiki_url, headers=headers)
            if wiki_response.status_code == 200:
                wiki_data = wiki_response.json()
                if wiki_data['query']['search']:
                    page_id = wiki_data['query']['search'][0]['pageid']
                    image_url_request = requests.get(
                        f"https://ru.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids={page_id}",
                        headers=headers
                    )
                    if image_url_request.status_code == 200:
                        image_data = image_url_request.json()
                        pages = image_data['query']['pages']
                        if pages and 'original' in pages[list(pages.keys())[0]].get('thumbnail', {}):
                            image_url = pages[list(pages.keys())[0]]['original']['source']

        # Сохранение изображения
        if image_url:
            image_response = requests.get(image_url, headers=headers)
            if image_response.status_code == 200:
                os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
                with open(image_path, 'wb') as f:
                    f.write(image_response.content)
                return f"{settings.MEDIA_URL}{sanitized_name}.jpg"

        return None