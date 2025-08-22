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

class CityDetailView(APIView):
    def get(self, request, name):
        try:
            city = City.objects.get(name=name)
        except City.DoesNotExist:
            return Response({"error": "City not found"}, status=status.HTTP_404_NOT_FOUND)

        tags = request.query_params.get('tags', '').split(',')
        attractions_query = Attraction.objects.filter(city=city)

        if tags and any(tag.strip() for tag in tags):
            attractions_query = attractions_query.filter(tags__icontains=tags[0])  # Используем icontains для текстового поиска

        attractions = attractions_query
        serializer = AttractionListSerializer(attractions, many=True)
        return Response({"city": name, "attractions": serializer.data}, status=status.HTTP_200_OK)

class CitySearchView(APIView):
    def get(self, request, query):
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