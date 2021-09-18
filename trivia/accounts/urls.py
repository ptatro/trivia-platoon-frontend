from rest_framework.authtoken.views import obtain_auth_token
# from .views import CustomObtainAuthToken
from .views import SignupView
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('get-token', CustomObtainAuthToken.as_view()),
    path('signup', SignupView.as_view()),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]