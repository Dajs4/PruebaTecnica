from django.urls import path
from .views import LoginView, ActaListView, ActaDetailView, GestionCreateView, protected_media

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('actas/', ActaListView.as_view(), name='acta-list'),
    path('actas/<int:pk>/', ActaDetailView.as_view(), name='acta-detail'),
    path('gestiones/', GestionCreateView.as_view(), name='gestion-create'),
    path('media/<path:path>', protected_media, name='protected-media'),
]