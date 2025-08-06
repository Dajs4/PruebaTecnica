# Sistema de Gestión de Actas

Una aplicación web básica para gestionar actas, compromisos y gestiones, desarrollada como prueba técnica.

## 🔗 Repositorio

**GitHub**: [https://github.com/Dajs4/PruebaTecnica.git](https://github.com/Dajs4/PruebaTecnica.git)

## 🚀 Características

- **Autenticación**: Login con email y contraseña
- **Gestión de Actas**: Listado con filtros por estado
- **Compromisos**: Visualización de compromisos por acta
- **Gestiones**: Creación de gestiones con archivos adjuntos
- **Archivos Protegidos**: Subida y acceso seguro a PDF/JPG
- **Interfaz Responsiva**: Diseño simple y funcional

## 🛠️ Tecnologías

### Backend
- **Django 5.2.4**: Framework web de Python
- **Django REST Framework**: API REST
- **SQLite**: Base de datos (incluida)
- **Token Authentication**: Autenticación simple

### Frontend
- **React 18**: Librería de JavaScript
- **Axios**: Cliente HTTP
- **CSS3**: Estilos personalizados
- **React Hooks**: Manejo de estado

## 📋 Requisitos

- **Python 3.8+**
- **Node.js 16+**
- **npm 7+**

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Dajs4/PruebaTecnica.git
cd PruebaTecnica
```

### 2. Configurar Backend (Django)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Cargar datos de ejemplo
python manage.py load_data

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 3. Configurar Frontend (React)

```bash
# Abrir nueva terminal y navegar a frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## 👤 Usuarios de Prueba

El comando `load_data` crea automáticamente estos usuarios:

| Tipo | Email | Contraseña | Nombre | Permisos |
|------|-------|------------|--------|----------|
| Admin | admin@test.com | admin123 | Admin Usuario | Puede ver todas las actas |
| Usuario Base | usuario@test.com | usuario123 | Usuario Base | Ve solo sus actas |
| Usuario Base | maria.garcia@test.com | maria123 | María García | Ve solo sus actas |

### Datos de ejemplo incluidos:
- **6 actas** con diferentes estados y creadores
- **11 compromisos** distribuidos entre las actas
- **Responsables variados** para probar filtros y permisos

## 📁 Estructura del Proyecto

```
PruebaTecnica/
├── backend/                 # Django Backend
│   ├── actas_app/          # Configuración principal
│   ├── api/                # App principal con modelos y vistas
│   ├── media/              # Archivos subidos (se crea automáticamente)
│   ├── db.sqlite3          # Base de datos (se crea al migrar)
│   └── manage.py           # Comando de Django
├── frontend/               # React Frontend
│   ├── public/             # Archivos públicos
│   ├── src/                # Código fuente
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios de API
│   │   └── styles/         # Archivos CSS
│   └── package.json        # Dependencias de Node.js
└── README.md               # Este archivo
```

## 🔗 API Endpoints

### Autenticación
- `POST /api/login/` - Iniciar sesión

### Actas
- `GET /api/actas/` - Listar actas (con filtro opcional `?estado=pendiente`)
- `GET /api/actas/{id}/` - Detalle de acta con compromisos

### Gestiones
- `POST /api/gestiones/` - Crear nueva gestión

### Archivos
- `GET /api/media/{path}` - Acceso protegido a archivos

## 📝 Modelos de Datos

### Usuario
- Email (único, usado para login)
- Username, nombre, apellidos
- Permisos de staff/admin

### Acta
- Título, estado (pendiente/en_progreso/completada)
- Fecha de creación
- Archivo PDF opcional

### Compromiso
- Vinculado a un acta
- Descripción, responsable, fecha límite

### Gestión
- Vinculada a un compromiso
- Descripción, archivo opcional, fecha, usuario

## 🛡️ Seguridad

- **Autenticación por token**: Todas las rutas protegidas
- **Validación de archivos**: Solo PDF/JPG, máximo 5MB
- **Acceso a archivos**: Requiere autenticación
- **CORS configurado**: Para desarrollo local

## 🚦 Validaciones

### Archivos
- Tipos permitidos: PDF, JPG, JPEG
- Tamaño máximo: 5MB
- Validación por MIME type y extensión

### Formularios
- Campos obligatorios validados
- Mensajes de error específicos
- Feedback visual en tiempo real

### Responsables de Compromisos
- Mínimo 2 palabras (nombre y apellido)
- Solo letras, espacios y caracteres válidos
- No puede estar vacío

## 🎨 Interfaz de Usuario

- **Diseño simple**: Sin frameworks CSS, estilos personalizados
- **Sistema de filtros**: Por estado, título y fecha
- **Navegación básica**: Entre listado y detalle de actas
- **Formularios funcionales**: Con validación y feedback
- **Estados visuales**: Loading, error, éxito
- **Responsive**: Adaptado a diferentes pantallas

## 🔍 Funcionalidades de Filtros

### Panel de Actas
- **Filtro por Estado**: Pendiente, En Progreso, Completada
- **Filtro por Título**: Búsqueda parcial insensible a mayúsculas
- **Filtro por Fecha**: Selección de fecha específica
- **Filtros Combinables**: Pueden usarse múltiples filtros simultáneamente
- **Botón Limpiar**: Resetea todos los filtros aplicados

## 🐛 Problemas Conocidos

- Base de datos SQLite incluida en el repositorio (para demostración)
- Sin paginación en listados
- Archivos media incluidos en Git (para pruebas)
- Sin manejo de errores de red avanzado

## 📄 Licencia

Este proyecto es de código abierto bajo la Licencia MIT.

## 🤝 Contribuir

Este es un proyecto de prueba técnica, pero las sugerencias son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para preguntas sobre la implementación, revisa el código o contacta al desarrollador.

---

**Desarrollado como prueba técnica - Implementación básica y funcional**