from rest_framework.authtoken.views import obtain_auth_token
from .views import SignupView
from django.urls import path

urlpatterns = [
    path('get-token', obtain_auth_token),
    path('signup', SignupView.as_view())
]