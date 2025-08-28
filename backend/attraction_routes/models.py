from django.db import models
from django.conf import settings
from attractions.models import Attraction


class Route(models.Model):
    """Маршрут, созданный пользователем или гидом"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="routes"
    )

    attractions = models.ManyToManyField(
        Attraction,
        through="RouteAttraction",
        related_name="routes"
    )

    is_public = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.creator})"


class RouteAttraction(models.Model):
    """Промежуточная модель для порядка достопримечательностей"""
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="route_attractions")
    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(db_index=True)

    class Meta:
        unique_together = ("route", "attraction")
        ordering = ["order"]

    def __str__(self):
        return f"{self.route.name} -> {self.order}: {self.attraction.name}"
