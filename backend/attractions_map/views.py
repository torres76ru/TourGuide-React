from venv import logger

import requests
import time
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.db.models import Q
from attractions.models import Attraction
from attractions.serializers import AttractionListSerializer
from cities.models import City
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
            city_name = (
                data.get("address", {}).get("city") or
                data.get("address", {}).get("town") or
                data.get("address", {}).get("village") or "Unknown"
            )
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
        radius = request.query_params.get('radius', 0.001)
        tags = request.query_params.get('tags', 'all').split(',')
        name_filter = request.query_params.get('name')


        if not tags or tags == [''] or tags == ['all']:
            tags = ['all']
            print("No tags provided, defaulting to tags='all'")

        if not lat or not lng:
            return Response({"error": "Широта и долгота обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)
            radius = float(radius)

            if radius < 0.001 or radius > 0.01:
                return Response({"error": "Радиус должен быть между 0.001 и 0.01"}, status=status.HTTP_400_BAD_REQUEST)

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

            if 'all' in tags:
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
                            "error": "Overpass API timed out after multiple attempts"
                        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                    else:
                        return Response({
                            "error": f"Overpass API error: {osm_response.status_code}, {osm_response.text}"
                        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                except requests.RequestException as e:
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)
                        continue
                    return Response({
                        "error": f"Failed to connect to Overpass API: {str(e)}"
                    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            osm_data = osm_response.json()
            matched_attractions = []
            delta = 0.0001


            category_map = {
                'museum': 'Музей',
                'park': 'Парк',
                'garden': 'Парк',
                'attraction': 'Достопримечательность',
                'monument': 'Достопримечательность',
                'zoo': 'Зоопарк',
                'theatre': 'Театр',
                'cinema': 'Кинотеатр',
                'library': 'Библиотека',
                'restaurant': 'Ресторан',
                'cafe': 'Кафе',
                'memorial': 'Достопримечательность',
                'archaeological_site': 'Достопримечательность',
            }

            for element in osm_data.get('elements', []):
                if 'lat' in element and 'lon' in element:
                    lat_osm = element['lat']
                    lng_osm = element['lon']
                elif 'center' in element:
                    center = element['center']
                    lat_osm = center['lat']
                    lng_osm = center['lon']
                else:
                    continue

                name = element.get('tags', {}).get('name', 'Unknown_Place')
                if name == 'Unknown_Place':
                    continue

                tags_element = element.get('tags', {})
                relevant_tags = {k: v for k, v in tags_element.items() if
                                k in ['tourism', 'historic', 'leisure', 'natural', 'piste:type', 'aerialway',
                                      'shop', 'amenity', 'building', 'religion', 'place', 'highway',
                                      'wikipedia', 'wikidata', 'description']}


                category = 'Достопримечательность'
                for tag_key, tag_value in tags_element.items():
                    if tag_key in ['tourism', 'leisure', 'historic', 'amenity']:
                        category = category_map.get(tag_value, 'Достопримечательность')
                        break


                attraction = Attraction.objects.filter(
                    name=name,
                    latitude__range=(lat_osm - delta, lat_osm + delta),
                    longitude__range=(lng_osm - delta, lng_osm + delta)
                ).first()

                if attraction:
                    matched_attractions.append(attraction)
                else:

                    address_data = self.get_address_from_coordinates(lat_osm, lng_osm)
                    city_name_osm = address_data["city_name"]
                    address = address_data["address"]


                    description = tags_element.get('description')
                    if not description and 'wikipedia' in tags_element:
                        wp_page = tags_element['wikipedia'].split(':', 1)[-1]
                        description = self.get_wikipedia_description(wp_page)


                    city = None
                    if city_name_osm and city_name_osm != "Unknown":
                        city, _ = City.objects.get_or_create(name=city_name_osm)


                    attraction = Attraction(
                        name=name,
                        category=category,
                        description=description,
                        description_short=description[:255] if description else None,
                        address=address,
                        latitude=lat_osm,
                        longitude=lng_osm,
                        city=city,
                        tags=relevant_tags if relevant_tags else {},
                        admin_reviewed=False,  # Автоматически добавлено
                        need_photo=True
                    )
                    attraction.save()
                    matched_attractions.append(attraction)

            custom_attractions = Attraction.objects.filter(
                latitude__gte=lat_min,
                latitude__lte=lat_max,
                longitude__gte=lng_min,
                longitude__lte=lng_max
            ).exclude(id__in=[a.id for a in matched_attractions])
            print(f"Custom attractions found: {custom_attractions.count()}")
            for attr in custom_attractions:
                print(
                    f"Custom attraction: ID={attr.id}, Name={attr.name}, Lat={attr.latitude}, Lon={attr.longitude}, Category={attr.category}, Tags={attr.tags}")

            if name_filter:
                custom_attractions = custom_attractions.filter(name__icontains=name_filter)
                print(f"Custom attractions after name filter '{name_filter}': {custom_attractions.count()}")

            if 'all' not in tags:
                possible_categories = set()
                tag_filters = []
                tag_mapping = {
                    'park': 'leisure', 'garden': 'leisure', 'museum': 'tourism', 'attraction': 'tourism',
                    'place_of_worship': 'amenity', 'christian': 'religion', 'muslim': 'religion',
                    'theatre': 'amenity', 'cinema': 'amenity', 'library': 'amenity',
                    'restaurant': 'amenity', 'cafe': 'amenity', 'monument': 'historic',
                    'zoo': 'tourism',
                }
                for tag in tags:
                    tag = tag.strip()

                    if tag in category_map:
                        possible_categories.add(category_map[tag])
                    else:

                        possible_categories.add(tag.capitalize())

                    if tag in tag_mapping:
                        tag_key = tag_mapping[tag]
                        tag_filters.append(Q(**{f"tags__{tag_key}": tag}))
                    else:

                        tag_filters.append(Q(**{f"tags__{tag}__iexact": tag}))


                custom_categories = set(Attraction.objects.filter(
                    latitude__gte=lat_min,
                    latitude__lte=lat_max,
                    longitude__gte=lng_min,
                    longitude__lte=lng_max
                ).values_list('category', flat=True).distinct())
                possible_categories.update(custom_categories - {None, ''})  # Исключаем None и пустые строки
                print(f"Possible categories: {possible_categories}")


                if possible_categories:
                    custom_attractions = custom_attractions.filter(category__in=possible_categories)
                    print(f"Custom attractions after category filter: {custom_attractions.count()}")
                else:
                    logger.info("No valid categories found, skipping category filter")


                if tag_filters:
                    from functools import reduce
                    import operator
                    tag_query = reduce(operator.or_, tag_filters)
                    custom_attractions = custom_attractions.filter(tag_query)
                    print(f"Custom attractions after tag filter: {custom_attractions.count()}")
                else:
                    logger.info("No valid tags found, skipping tag filter")
            else:
                logger.info("No category or tag filtering for custom attractions (tags='all')")

            all_attractions = matched_attractions + list(custom_attractions)
            print(f"Total attractions: {len(all_attractions)}")

            if not all_attractions:
                response_data = {
                    "message": "Достопримечательности в указанной области отсутствуют"
                }
                return Response(response_data, status=status.HTTP_200_OK)

            response_data = {
                "city": city_name,
                "attractions": []
            }

            attractions_qs = Attraction.objects.filter(
                id__in=[a.id for a in all_attractions]
            ).prefetch_related('ratings')
            print(f"Attractions in queryset: {list(attractions_qs.values('id', 'name'))}")
            serializer = AttractionListSerializer(attractions_qs, many=True)
            print(f"Serialized data: {serializer.data}")
            response_data["attractions"] = serializer.data

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Некорректные значения широты, долготы или радиуса"}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({"error": "Широта и долгота обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat, lng = float(lat), float(lng)

            cache_key = f"city_location_{lat}_{lng}"
            cached_city = cache.get(cache_key)
            if cached_city:
                return Response({"city": cached_city}, status=status.HTTP_200_OK)

            city_name = self.get_address_from_coordinates(lat, lng)

            if city_name == "Unknown":
                return Response({"error": "Город не найден"}, status=status.HTTP_404_NOT_FOUND)

            try:
                city = City.objects.get(name=city_name)
            except City.DoesNotExist:
                return Response({"error": "Город не найден в базе данных"}, status=status.HTTP_404_NOT_FOUND)

            cache.set(cache_key, city_name, timeout=3600)

            return Response({"city": city_name}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Некорректные значения широты или долготы"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)