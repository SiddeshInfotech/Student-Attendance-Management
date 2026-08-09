from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization")
        if not header or not header.startswith("Bearer "):
            return None

        raw_token = header.split(" ")[1]
        try:
            validated_token = AccessToken(raw_token)
            user_id = validated_token.get("user_id")
            if not user_id:
                return None

            from users.models import User
            user = User.objects.filter(user_id=user_id).first()
            if not user:
                raise AuthenticationFailed("User not found")

            return (user, validated_token)
        except Exception as e:
            raise AuthenticationFailed(str(e))

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = getattr(user, "username", getattr(user, "email", ""))
        token["role"] = getattr(user, "role", "student")
        token["email"] = getattr(user, "email", "")
        token["user_id"] = getattr(user, "user_id", getattr(user, "id", None))
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

