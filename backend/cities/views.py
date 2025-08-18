# attractions/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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

        attractions = Attraction.objects.filter(city=city)
        serializer = AttractionListSerializer(attractions, many=True)
        return Response({"city": name, "attractions": serializer.data}, status=status.HTTP_200_OK)