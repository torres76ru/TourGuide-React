import logging

from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from attractions.models import Attraction
from attractions.serializers import AttractionListSerializer
from .models import City

class CityListView(APIView):
    def get(self, request):
        cities = City.objects.filter(attractions__isnull=False).distinct()
        return Response([city.name for city in cities if city.name], status=status.HTTP_200_OK)

logger = logging.getLogger(__name__)

class CityDetailView(APIView):
    def post(self, request):
        city_name = request.data.get('city')
        tags = request.data.get('tags', '')

        if not city_name:
            return Response({"error": "City name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            city = City.objects.get(name=city_name)
        except City.DoesNotExist:
            return Response({"error": "City not found"}, status=status.HTTP_404_NOT_FOUND)

        attractions_query = Attraction.objects.filter(city=city)
        if tags and tags.strip():
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
            tag_query = Q()
            for tag in tag_list:
                tag_query |= (
                        Q(tags__tourism=tag) |
                        Q(tags__historic=tag) |
                        Q(tags__leisure=tag) |
                        Q(tags__natural=tag) |
                        Q(tags__piste__type=tag) |
                        Q(tags__aerialway=tag) |
                        Q(tags__shop=tag) |
                        Q(tags__amenity=tag) |
                        Q(tags__building=tag) |
                        Q(tags__religion=tag) |
                        Q(tags__place=tag) |
                        Q(tags__highway=tag) |
                        Q(tags__wikipedia=tag) |
                        Q(tags__wikidata=tag) |
                        Q(tags__description=tag)
                )
            attractions_query = attractions_query.filter(tag_query)
            logger.info(
                f"POST: Filtered attractions for city '{city_name}' with tags '{tags}': {attractions_query.count()}")

        attractions = attractions_query
        serializer = AttractionListSerializer(attractions, many=True)
        return Response({"city": city_name, "attractions": serializer.data}, status=status.HTTP_200_OK)

class CitySearchView(APIView):
    def get(self, request, query=None):
        if query is None:
            return Response({"error": "Query parameter is required for GET"}, status=status.HTTP_400_BAD_REQUEST)

        if len(query) < 3:
            return Response({"error": "Query must be at least 3 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cache_key = f"city_search_{query.lower()}"
            cached_cities = cache.get(cache_key)
            if cached_cities:
                return Response(cached_cities, status=status.HTTP_200_OK)

            cities = City.objects.filter(name__icontains=query).distinct()
            if not cities:
                return Response({"error": "No cities found matching the query"}, status=status.HTTP_404_NOT_FOUND)

            response_data = [city.name for city in cities]
            cache.set(cache_key, response_data, timeout=3600)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):

        query = request.data.get('city', '')

        if not query:
            return Response({"error": "City name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if len(query) < 3:
            return Response({"error": "City name must be at least 3 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cache_key = f"city_search_{query.lower()}"
            cached_cities = cache.get(cache_key)
            if cached_cities:
                return Response(cached_cities, status=status.HTTP_200_OK)

            cities = City.objects.filter(name__icontains=query).distinct()
            if not cities:
                return Response({"error": "No cities found matching the query"}, status=status.HTTP_404_NOT_FOUND)

            response_data = [city.name for city in cities]
            cache.set(cache_key, response_data, timeout=3600)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)