import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token a requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir al login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login/', { email, password });
    return response.data;
  }
};

export const actasService = {
  getActas: async (filtros = {}) => {
    // Si es un string (compatibilidad con la función anterior)
    if (typeof filtros === 'string') {
      filtros = filtros ? { estado: filtros } : {};
    }
    
    const response = await api.get('/actas/', { params: filtros });
    return response.data;
  },
  
  getActaDetail: async (id) => {
    const response = await api.get(`/actas/${id}/`);
    return response.data;
  }
};

export const gestionesService = {
  createGestion: async (data) => {
    const formData = new FormData();
    formData.append('compromiso', data.compromiso);
    formData.append('descripcion', data.descripcion);
    if (data.archivo) {
      formData.append('archivo', data.archivo);
    }
    
    const response = await api.post('/gestiones/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;