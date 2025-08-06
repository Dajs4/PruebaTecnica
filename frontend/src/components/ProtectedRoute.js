import React, { useState, useEffect } from 'react';
import { authUtils } from '../services/auth';
import '../styles/ProtectedRoute.css';

const ProtectedRoute = ({ children, onAuthFail }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyAuthentication();
  }, []);

  const verifyAuthentication = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Primero verificar localmente
      if (!authUtils.isAuthenticated()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        onAuthFail && onAuthFail();
        return;
      }

      // Luego verificar con el servidor
      const isValidToken = await authUtils.verifyToken();
      
      if (!isValidToken) {
        setIsAuthenticated(false);
        setError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        onAuthFail && onAuthFail();
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setError('Error al verificar la autenticación. Verifica tu conexión.');
      onAuthFail && onAuthFail();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="protected-route-error">
        <div className="error-icon">🔒</div>
        <h2>Acceso Restringido</h2>
        <p>{error || 'Necesitas iniciar sesión para acceder a esta página.'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;