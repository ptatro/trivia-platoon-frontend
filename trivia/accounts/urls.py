from rest_framework.authtoken.views import obtain_auth_token
from .views import CustomObtainAuthToken
from .views import SignupView
from django.urls import path

urlpatterns = [
    path('get-token', CustomObtainAuthToken.as_view()),
    path('signup', SignupView.as_view())
]