from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from trivia import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('game.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
