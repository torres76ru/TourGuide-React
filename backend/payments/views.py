import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from tours.models import Tour
from django.contrib.auth import get_user_model
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        tour_id = request.data.get("tour_id")
        try:
            tour = Tour.objects.get(id=tour_id)
        except Tour.DoesNotExist:
            return Response({"error": "Тур не найден"}, status=404)

        # создаем оплату в БД
        payment = Payment.objects.create(
            user=request.user,
            tour=tour,
            amount=tour.price,
            status="pending"
        )

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "rub",
                        "unit_amount": int(tour.price * 100),  # копейки
                        "product_data": {
                            "name": f"Оплата тура: {tour.title}",
                        },
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url="http://localhost:3000/payment-success/",
                cancel_url="http://localhost:3000/payment-cancel/",
                client_reference_id=str(request.user.id),
                metadata={
                    "tour_id": str(tour.id),
                    "payment_id": str(payment.id),
                }
            )

            payment.stripe_session_id = checkout_session.id
            payment.save()

            return Response({"url": checkout_session.url})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        payment_id = session["metadata"].get("payment_id")
        tour_id = session["metadata"].get("tour_id")
        user_id = session.get("client_reference_id")

        try:
            payment = Payment.objects.get(id=payment_id)
            payment.status = "paid"
            payment.stripe_payment_intent = session.get("payment_intent")
            payment.save()

            # добавляем пользователя в участники тура
            tour = Tour.objects.get(id=tour_id)
            User = get_user_model()
            user = User.objects.get(id=user_id)
            tour.add_participant(user)

        except Exception as e:
            print("Ошибка при добавлении участника:", e)

    return HttpResponse(status=200)