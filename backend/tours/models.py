from django.db import models
from django.conf import settings
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField


class Tour(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    date = models.DateField()
    image = models.ImageField(upload_to="tours_img/", blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=50)

    guide = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tours"
    )

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="tours_joined",
        blank=True
    )

    meeting_email = models.EmailField(default="Email для связи не указан")
    meeting_phone = PhoneNumberField(region="RU", null=True, blank=True)
    meeting_address = models.CharField(max_length=255, default="Адрес не указан")

    max_participants = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.date < timezone.now().date():
            raise ValidationError("Дата экскурсии не может быть в прошлом.")

    @property
    def available_slots(self):
        return self.max_participants - self.participants.count()

    def add_participant(self, user):
        if user in self.participants.all():
            raise ValidationError("Вы уже записаны.")
        if self.participants.count() >= self.max_participants:
            raise ValidationError("Достигнут лимит участников.")
        self.participants.add(user)

    def remove_participant(self, user):
        if user not in self.participants.all():
            raise ValidationError("Вы не записаны.")
        self.participants.remove(user)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Экскурсия"
        verbose_name_plural = "Экскурсии"

    def __str__(self):
        return self.title


from django.db import models


class Schedule(models.Model):
    DAYS_OF_WEEK = [
        (0, "Понедельник"),
        (1, "Вторник"),
        (2, "Среда"),
        (3, "Четверг"),
        (4, "Пятница"),
        (5, "Суббота"),
        (6, "Воскресенье"),
    ]

    tour = models.ForeignKey(
        "Tour",
        on_delete=models.CASCADE,
        related_name="schedules",
        null=True,
        blank=True
    )
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ["day_of_week", "start_time"]
        verbose_name = "Расписание"
        verbose_name_plural = "Расписания"

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.start_time}–{self.end_time}"
