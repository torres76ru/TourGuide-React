from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from attractions.models import Attraction
from attractions.serializers import AttractionListSerializer

class CityListView(APIView):
    def get(self, request):
        cities = Attraction.objects.values('city').distinct()
        return Response([city['city'] for city in cities if city['city']], status=status.HTTP_200_OK)

class CityDetailView(APIView):
    def get(self, request, name):
        attractions = Attraction.objects.filter(city=name)
        if not attractions.exists():
            return Response({"error": "City not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AttractionListSerializer(attractions, many=True)
        return Response({"city": name, "attractions": serializer.data}, status=status.HTTP_200_OK)