from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth import authenticate
from django.http import HttpResponse, Http404
from django.conf import settings
from django.db import models
import os
from .models import Acta, Gestion
from .serializers import ActaListSerializer, ActaDetailSerializer, GestionSerializer

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Buscar usuario por email y autenticar
        try:
            from .models import Usuario
            user = Usuario.objects.get(email=email)
            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': user.id,
                    'email': user.email,
                    'rol': user.rol,
                    'is_admin': user.rol == 'admin'
                })
        except Usuario.DoesNotExist:
            pass
        
        return Response({'error': 'Credenciales inválidas'}, status=400)

class ActaListView(generics.ListAPIView):
    serializer_class = ActaListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Si es admin, puede ver todas las actas
        if user.rol == 'admin':
            queryset = Acta.objects.all()
        else:
            # Usuario base solo ve actas que creó o donde es responsable de compromisos
            # Buscar por nombre completo del usuario en responsable
            user_full_name = f"{user.first_name} {user.last_name}".strip()
            queryset = Acta.objects.filter(
                models.Q(creador=user) | 
                models.Q(compromisos__responsable__icontains=user.first_name) |
                models.Q(compromisos__responsable__icontains=user.last_name) |
                models.Q(compromisos__responsable=user_full_name)
            ).distinct()
        
        # Filtros
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
            
        titulo = self.request.query_params.get('titulo')
        if titulo:
            queryset = queryset.filter(titulo__icontains=titulo)
            
        fecha = self.request.query_params.get('fecha')
        if fecha:
            queryset = queryset.filter(fecha__date=fecha)
            
        return queryset.order_by('-fecha')

class ActaDetailView(generics.RetrieveAPIView):
    serializer_class = ActaDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Si es admin, puede ver todas las actas
        if user.rol == 'admin':
            return Acta.objects.all()
        else:
            # Usuario base solo ve actas que creó o donde es responsable de compromisos
            # Buscar por nombre completo del usuario en responsable
            user_full_name = f"{user.first_name} {user.last_name}".strip()
            return Acta.objects.filter(
                models.Q(creador=user) | 
                models.Q(compromisos__responsable__icontains=user.first_name) |
                models.Q(compromisos__responsable__icontains=user.last_name) |
                models.Q(compromisos__responsable=user_full_name)
            ).distinct()

class GestionCreateView(generics.CreateAPIView):
    serializer_class = GestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def protected_media(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.exists(file_path):
        raise Http404
    
    try:
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read())
            
        if path.endswith('.pdf'):
            response['Content-Type'] = 'application/pdf'
        elif path.endswith(('.jpg', '.jpeg')):
            response['Content-Type'] = 'image/jpeg'
        
        return response
    except Exception as e:
        print(f"Error serving file: {e}")
        raise Http404
