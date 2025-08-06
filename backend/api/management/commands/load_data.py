from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Acta, Compromiso
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Carga datos de ejemplo en la base de datos'

    def handle(self, *args, **options):
        # Crear usuario admin
        admin_user, created = User.objects.get_or_create(
            email='admin@test.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'Usuario',
                'rol': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Usuario admin creado')
        
        # Crear usuario base
        base_user, created = User.objects.get_or_create(
            email='usuario@test.com',
            defaults={
                'username': 'usuario',
                'first_name': 'Usuario',
                'last_name': 'Base',
                'rol': 'usuario_base',
            }
        )
        if created:
            base_user.set_password('usuario123')
            base_user.save()
            self.stdout.write('Usuario base creado')

        # Crear segundo usuario base para demostración
        user2, created = User.objects.get_or_create(
            email='maria.garcia@test.com',
            defaults={
                'username': 'maria.garcia',
                'first_name': 'María',
                'last_name': 'García',
                'rol': 'usuario_base',
            }
        )
        if created:
            user2.set_password('maria123')
            user2.save()
            self.stdout.write('Usuario María García creado')
        
        # Crear actas de ejemplo
        acta1, created = Acta.objects.get_or_create(
            titulo='Reunión de planificación Q1 2024',
            defaults={
                'estado': 'pendiente',
                'creador': admin_user,
                'pdf': 'actas/acta_ejemplo.pdf',
            }
        )
        if created:
            self.stdout.write('Acta 1 creada')
        elif not acta1.pdf:
            acta1.pdf = 'actas/acta_ejemplo.pdf'
            acta1.save()
            self.stdout.write('Acta 1 actualizada con PDF')
        
        acta2, created = Acta.objects.get_or_create(
            titulo='Revisión de presupuesto anual',
            defaults={
                'estado': 'en_progreso',
                'creador': base_user,
            }
        )
        if created:
            self.stdout.write('Acta 2 creada')
        
        acta3, created = Acta.objects.get_or_create(
            titulo='Capacitación de equipo técnico',
            defaults={
                'estado': 'completada',
                'creador': admin_user,
                'pdf': 'actas/acta_ejemplo.pdf',
            }
        )
        if created:
            self.stdout.write('Acta 3 creada')
        elif not acta3.pdf:
            acta3.pdf = 'actas/acta_ejemplo.pdf'
            acta3.save()
            self.stdout.write('Acta 3 actualizada con PDF')

        # Más actas para demostración de filtros
        acta4, created = Acta.objects.get_or_create(
            titulo='Revisión de seguridad informática',
            defaults={
                'estado': 'pendiente',
                'creador': user2,
            }
        )
        if created:
            self.stdout.write('Acta 4 creada')

        acta5, created = Acta.objects.get_or_create(
            titulo='Implementación de nuevas políticas',
            defaults={
                'estado': 'en_progreso',
                'creador': base_user,
            }
        )
        if created:
            self.stdout.write('Acta 5 creada')

        acta6, created = Acta.objects.get_or_create(
            titulo='Evaluación de desempeño anual',
            defaults={
                'estado': 'completada',
                'creador': user2,
            }
        )
        if created:
            self.stdout.write('Acta 6 creada')
        
        # Crear compromisos de ejemplo
        Compromiso.objects.get_or_create(
            acta=acta1,
            descripcion='Definir objetivos del primer trimestre',
            defaults={
                'responsable': 'Juan Pérez',
                'fecha_limite': date.today() + timedelta(days=15),
            }
        )
        
        Compromiso.objects.get_or_create(
            acta=acta1,
            descripcion='Asignar recursos para nuevos proyectos',
            defaults={
                'responsable': 'Usuario Base',
                'fecha_limite': date.today() + timedelta(days=30),
            }
        )
        
        Compromiso.objects.get_or_create(
            acta=acta2,
            descripcion='Revisar gastos operativos del año anterior',
            defaults={
                'responsable': 'Carlos López',
                'fecha_limite': date.today() + timedelta(days=7),
            }
        )
        
        Compromiso.objects.get_or_create(
            acta=acta3,
            descripcion='Organizar sesiones de capacitación mensuales',
            defaults={
                'responsable': 'Ana Martínez',
                'fecha_limite': date.today() + timedelta(days=45),
            }
        )

        # Compromisos adicionales para las nuevas actas
        Compromiso.objects.get_or_create(
            acta=acta4,
            descripcion='Realizar auditoría de sistemas',
            defaults={
                'responsable': 'Usuario Base',
                'fecha_limite': date.today() + timedelta(days=20),
            }
        )

        Compromiso.objects.get_or_create(
            acta=acta4,
            descripcion='Actualizar políticas de contraseñas',
            defaults={
                'responsable': 'María García',
                'fecha_limite': date.today() + timedelta(days=10),
            }
        )

        Compromiso.objects.get_or_create(
            acta=acta5,
            descripcion='Implementar nuevo sistema de reportes',
            defaults={
                'responsable': 'Carlos López',
                'fecha_limite': date.today() + timedelta(days=35),
            }
        )

        Compromiso.objects.get_or_create(
            acta=acta5,
            descripcion='Capacitar personal en nuevos procedimientos',
            defaults={
                'responsable': 'María García',
                'fecha_limite': date.today() + timedelta(days=25),
            }
        )

        Compromiso.objects.get_or_create(
            acta=acta6,
            descripcion='Completar evaluaciones individuales',
            defaults={
                'responsable': 'Ana Martínez',
                'fecha_limite': date.today() - timedelta(days=5),  # Fecha pasada
            }
        )

        Compromiso.objects.get_or_create(
            acta=acta6,
            descripcion='Generar informe consolidado de evaluaciones',
            defaults={
                'responsable': 'Usuario Base',
                'fecha_limite': date.today() - timedelta(days=2),  # Fecha pasada
            }
        )

        # Compromiso adicional para acta1 con más responsables
        Compromiso.objects.get_or_create(
            acta=acta1,
            descripcion='Revisar y aprobar nuevos contratos',
            defaults={
                'responsable': 'María García',
                'fecha_limite': date.today() + timedelta(days=12),
            }
        )
        
        self.stdout.write(self.style.SUCCESS('Datos de ejemplo cargados exitosamente'))