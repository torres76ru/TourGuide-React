from rest_framework import serializers
from .models import Route, RouteAttraction
from attractions.serializers import AttractionListSerializer


class RouteAttractionSerializer(serializers.ModelSerializer):
    attraction = AttractionListSerializer(read_only=True)
    attraction_id = serializers.PrimaryKeyRelatedField(
        queryset=RouteAttraction._meta.get_field("attraction").related_model.objects.all(),
        source="attraction",
        write_only=True
    )

    class Meta:
        model = RouteAttraction
        fields = ["id", "attraction", "attraction_id", "order"]


class RouteSerializer(serializers.ModelSerializer):
    attractions = RouteAttractionSerializer(many=True, source="route_attractions")

    class Meta:
        model = Route
        fields = ["id", "name", "description", "creator", "attractions", "is_public", "created_at"]
        read_only_fields = ["creator", "created_at"]

    def create(self, validated_data):
        attractions_data = validated_data.pop("route_attractions", [])
        route = Route.objects.create(creator=self.context["request"].user, **validated_data)

        for idx, attr_data in enumerate(attractions_data):
            RouteAttraction.objects.create(
                route=route,
                attraction=attr_data["attraction"],
                order=attr_data.get("order", idx + 1)
            )

        return route

    def update(self, instance, validated_data):
        attractions_data = validated_data.pop("route_attractions", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if attractions_data is not None:
            instance.route_attractions.all().delete()
            for idx, attr_data in enumerate(attractions_data):
                RouteAttraction.objects.create(
                    route=instance,
                    attraction=attr_data["attraction"],
                    order=attr_data.get("order", idx + 1)
                )

        return instance
