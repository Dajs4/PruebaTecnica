export const authUtils = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Verificar que existan token y usuario
    if (!token || !user) {
      return false;
    }

    // Verificar que el usuario sea válido
    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.id || !parsedUser.email) {
        return false;
      }
    } catch (error) {
      // Si hay error al parsear, limpiar datos corruptos
      this.logout();
      return false;
    }

    return true;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si el token es válido haciendo una petición al backend
  verifyToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Hacer una petición simple para verificar si el token es válido
      const response = await fetch('http://localhost:8000/api/actas/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token inválido o expirado
        this.logout();
        return false;
      }

      return response.ok;
    } catch (error) {
      // Error de red o servidor
      return false;
    }
  }
};