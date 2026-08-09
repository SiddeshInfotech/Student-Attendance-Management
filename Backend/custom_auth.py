from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

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
                # Token is valid but user no longer exists — deny access
                raise AuthenticationFailed("User not found")

            return (user, validated_token)

        except (TokenError, InvalidToken):
            # Token is expired or invalid — return None so AllowAny views
            # (signup, login, forgot-password) still work normally.
            # Views that require authentication will deny access via permissions.
            return None

        except AuthenticationFailed:
            raise

        except Exception:
            # Any other unexpected error — treat as unauthenticated
            return None

