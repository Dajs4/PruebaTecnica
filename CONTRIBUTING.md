# Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Gestión de Actas!

## 🚀 Primeros Pasos

1. **Fork** el repositorio
2. **Clone** tu fork localmente
3. **Crea** una rama para tu feature/fix
4. **Implementa** tus cambios
5. **Envía** un Pull Request

## 📋 Antes de Contribuir

### Configuración del Entorno

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py load_data

# Frontend
cd frontend
npm install
```

### Ejecutar Tests

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## 🎯 Tipos de Contribuciones

### 🐛 Bug Fixes
- Describe el problema claramente
- Incluye pasos para reproducir
- Proporciona una solución probada

### ✨ Nuevas Características
- Discute primero la característica en un issue
- Mantén el alcance pequeño y enfocado
- Asegúrate de que sea compatible con el diseño actual

### 📚 Documentación
- Mejoras en README.md
- Comentarios en código
- Guías de usuario

### 🎨 Mejoras de UI/UX
- Mantén la simplicidad del diseño actual
- Asegúrate de que sea responsive
- No uses frameworks CSS externos

## 📝 Estándares de Código

### Backend (Django)
- Sigue PEP 8
- Usa nombres descriptivos para variables y funciones
- Comentarios solo cuando sea necesario
- Mantén las vistas simples

### Frontend (React)
- Usa componentes funcionales con hooks
- Mantén los archivos CSS separados
- No uses estilos en línea
- Estructura clara de carpetas

### General
- Commits descriptivos en inglés
- Un commit por cambio lógico
- Mensajes de commit en formato: `tipo: descripción`

## 🏗️ Estructura de Commits

```
feat: agregar validación de archivos
fix: corregir error de autenticación
docs: actualizar README con instrucciones
style: reorganizar estilos CSS
refactor: simplificar componente Login
test: agregar tests para API de actas
```

## 🔍 Process de Review

1. **Auto-review**: Revisa tu propio código antes de enviar
2. **Tests**: Asegúrate de que todos los tests pasen
3. **Descripción**: Explica qué hace tu PR y por qué
4. **Screenshots**: Para cambios visuales, incluye imágenes

## 🚫 Qué NO Hacer

- No agregues dependencias sin discutir primero
- No cambies la estructura básica del proyecto
- No includes archivos de configuración personales
- No subas archivos de base de datos con datos reales
- No uses frameworks CSS como Bootstrap o Tailwind

## 📞 ¿Necesitas Ayuda?

- Abre un **Issue** para discutir ideas
- Revisa la documentación existente
- Mira otros PRs para ejemplos

## 🎉 Reconocimientos

Todos los contribuidores serán reconocidos en el README principal.

---

**¡Esperamos tu contribución!** 🚀