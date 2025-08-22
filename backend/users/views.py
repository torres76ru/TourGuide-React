from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse

from .serializers import RegisterSerializer, UserSerializer
from .tokens import account_activation_token


User = get_user_model()


# POST /api/auth/register/
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        self.user = serializer.save(is_active=True)  # создаем сразу активного пользователя

        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = account_activation_token.make_token(self.user)
        activation_link = self.request.build_absolute_uri(
            reverse('activate', kwargs={'uidb64': uid, 'token': token})
        )

        send_mail(
            subject='Подтверждение регистрации',
            message=f'Для активации аккаунта перейдите по ссылке: {activation_link}',
            from_email='noreply@example.com',
            recipient_list=[self.user.email],
        )

    def create(self, request, *args, **kwargs):
        """Добавляем JWT токены в ответ"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        refresh = RefreshToken.for_user(self.user)

        headers = self.get_success_headers(serializer.data)
        return Response({
            "user": UserSerializer(self.user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED, headers=headers)


# POST /api/auth/login/
class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        login = request.data.get("username")
        password = request.data.get("password")
        user = None

        if '@' in login:
            try:
                user_obj = User.objects.get(email=login)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            user = authenticate(username=login, password=password)

        if not user:
            return Response({"error": "Неверные учетные данные"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({"error": "Аккаунт не активирован"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


# GET /api/auth/me/
class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# GET /api/auth/activate/<uidb64>/<token>/
class ActivateAccountView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'status': 'Аккаунт активирован'}, status=200)
        else:
            return Response({'error': 'Ссылка недействительна'}, status=400)
