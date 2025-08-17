from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    """Адаптер для обычной регистрации (по email)"""
    # Тут можно добавить свою логику, но по умолчанию mandatory email verification оставим
    pass

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Адаптер для соцсетей (Google и др.)"""
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form=form)
        if not user.is_active:
            user.is_active = True
            user.save()
        return user