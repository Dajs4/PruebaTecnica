import React, { useState } from 'react';
import { authService } from '../services/api';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user_id,
        email: response.email,
        rol: response.rol,
        is_admin: response.is_admin
      }));
      onLogin(response);
    } catch (error) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="test-users">
        <p><strong>Usuarios de prueba:</strong></p>
        <p>Admin: admin@test.com / admin123</p>
        <p>Usuario: usuario@test.com / usuario123</p>
      </div>
    </div>
  );
};

export default Login;