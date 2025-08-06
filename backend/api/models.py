from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import os

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    valid_extensions = ['.pdf', '.jpg', '.jpeg']
    if ext not in valid_extensions:
        raise ValidationError('Solo se permiten archivos PDF, JPG o JPEG')

def validate_file_size(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:  # 5MB
        raise ValidationError('El archivo no puede ser mayor a 5MB')

def validate_responsable(value):
    if not value.strip():
        raise ValidationError('El responsable no puede estar vacío')
    
    # Verificar que tenga al menos un nombre y apellido
    palabras = value.strip().split()
    if len(palabras) < 2:
        raise ValidationError('El responsable debe incluir al menos nombre y apellido')
    
    # Verificar que solo contenga letras, espacios y caracteres válidos
    import re
    if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
        raise ValidationError('El responsable solo puede contener letras y espacios')

class Usuario(AbstractUser):
    ROLES = [
        ('admin', 'Administrador'),
        ('usuario_base', 'Usuario Base'),
    ]
    
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default='usuario_base')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Acta(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada', 'Completada'),
    ]
    
    titulo = models.CharField(max_length=200)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateTimeField(auto_now_add=True)
    pdf = models.FileField(upload_to='actas/', null=True, blank=True, 
                          validators=[validate_file_extension, validate_file_size])
    creador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='actas_creadas', null=True, blank=True)
    
    def __str__(self):
        return self.titulo

class Compromiso(models.Model):
    acta = models.ForeignKey(Acta, on_delete=models.CASCADE, related_name='compromisos')
    descripcion = models.TextField()
    responsable = models.CharField(max_length=100, validators=[validate_responsable])
    fecha_limite = models.DateField()
    
    def __str__(self):
        return f"Compromiso: {self.descripcion[:50]}"

class Gestion(models.Model):
    compromiso = models.ForeignKey(Compromiso, on_delete=models.CASCADE, related_name='gestiones')
    descripcion = models.TextField()
    archivo = models.FileField(upload_to='gestiones/', null=True, blank=True,
                              validators=[validate_file_extension, validate_file_size])
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Gestión: {self.descripcion[:50]}"
