from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django.http import JsonResponse
from yookassa import Configuration, Payment
from django.conf import settings
from tours.models import Tour, TourRegistration

# Конфигурация YooKassa
Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY


class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tour_id):
        try:
            tour = Tour.objects.get(id=tour_id)

            if tour.available_slots <= 0:
                return Response({"error": "Нет свободных мест"}, status=400)

            payment = Payment.create({
                "amount": {
                    "value": str(tour.price),
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "http://localhost:3000/payment/success"
                },
                "capture": True,
                "description": f"Оплата за экскурсию {tour.title}"
            })

            reg, created = TourRegistration.objects.get_or_create(
                user=request.user,
                tour=tour,
                defaults={"payment_id": payment.id}
            )
            if not created:
                reg.payment_id = payment.id
                reg.save()

            return Response({"payment_url": payment.confirmation.confirmation_url})

        except Tour.DoesNotExist:
            return Response({"error": "Экскурсия не найдена"}, status=404)


@api_view(["POST"])
def yookassa_webhook(request):
    event = request.data
    if event.get("event") == "payment.succeeded":
        payment_id = event["object"]["id"]

        try:
            reg = TourRegistration.objects.get(payment_id=payment_id)
            reg.paid = True
            reg.save()
            reg.tour.participants.add(reg.user)  # добавляем в экскурсию
        except TourRegistration.DoesNotExist:
            pass

    return JsonResponse({"status": "ok"})
