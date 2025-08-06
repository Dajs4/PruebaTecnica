import React, { useState, useEffect, useCallback, useRef } from 'react';
import { authUtils } from '../services/auth';
import { actasService } from '../services/api';
import '../styles/ActasList.css';

const ActasList = ({ onSelectActa }) => {
  const [actas, setActas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    estado: '',
    titulo: '',
    fecha: ''
  });
  const user = authUtils.getUser();
  
  const debounceRef = useRef(null);

  const loadActas = useCallback(async (filtrosActuales = {}) => {
    try {
      setLoading(true);
      const data = await actasService.getActas(filtrosActuales);
      setActas(data);
    } catch (error) {
      setError('Error al cargar las actas');
    } finally {
      setLoading(false);
    }
  }, []);

  const ejecutarBusqueda = useCallback((filtrosActuales = filtros) => {
    const filtrosLimpios = {};
    Object.keys(filtrosActuales).forEach(key => {
      if (filtrosActuales[key]) {
        filtrosLimpios[key] = filtrosActuales[key];
      }
    });
    loadActas(filtrosLimpios);
  }, [loadActas, filtros]);

  useEffect(() => {
    loadActas();
  }, [loadActas]);

  const handleFilterChange = useCallback((tipo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [tipo]: valor
    };
    
    setFiltros(nuevosFiltros);
    
    // Para título: debounce
    if (tipo === 'titulo') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        ejecutarBusqueda(nuevosFiltros);
      }, 300);
    } else {
      // Para estado y fecha: inmediato
      ejecutarBusqueda(nuevosFiltros);
    }
  }, [filtros, ejecutarBusqueda]);

  const limpiarFiltros = useCallback(() => {
    const filtrosVacios = { estado: '', titulo: '', fecha: '' };
    setFiltros(filtrosVacios);
    loadActas({});
  }, [loadActas]);

  const handleLogout = useCallback(() => {
    authUtils.logout();
    window.location.reload();
  }, []);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }, []);

  const getEstadoClass = useCallback((estado) => {
    switch (estado) {
      case 'pendiente': return 'estado-badge estado-pendiente';
      case 'en_progreso': return 'estado-badge estado-en-progreso';
      case 'completada': return 'estado-badge estado-completada';
      default: return 'estado-badge estado-default';
    }
  }, []);

  if (loading) {
    return <div className="loading-message">Cargando actas...</div>;
  }

  return (
    <div className="actas-container">
      <div className="actas-header">
        <h1 className="actas-title">Lista de Actas</h1>
        <div className="user-info">
          <span className="user-email">
            Bienvenido: {user?.email} 
            <span className="user-role">({user?.rol === 'admin' ? 'Administrador' : 'Usuario Base'})</span>
          </span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Estado:</label>
            <select 
              data-filter="estado"
              value={filtros.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Título:</label>
            <input 
              type="text"
              data-filter="titulo"
              value={filtros.titulo}
              onChange={(e) => handleFilterChange('titulo', e.target.value)}
              className="filter-input"
              placeholder="Buscar por título..."
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Fecha:</label>
            <input 
              type="date"
              data-filter="fecha"
              value={filtros.fecha}
              onChange={(e) => handleFilterChange('fecha', e.target.value)}
              className="filter-input"
            />
          </div>

          <button onClick={limpiarFiltros} className="clear-filters-button">
            Limpiar Filtros
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <table className="actas-table">
        <thead>
          <tr className="table-header">
            <th className="table-cell">Título</th>
            <th className="table-cell">Estado</th>
            <th className="table-cell">Fecha</th>
            <th className="table-cell">Compromisos</th>
            <th className="table-cell">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actas.length === 0 ? (
            <tr>
              <td colSpan="5" className="table-cell-center no-data">
                No hay actas disponibles
              </td>
            </tr>
          ) : (
            actas.map((acta) => (
              <tr key={acta.id}>
                <td className="table-cell">{acta.titulo}</td>
                <td className="table-cell">
                  <span className={getEstadoClass(acta.estado)}>
                    {acta.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="table-cell">{formatDate(acta.fecha)}</td>
                <td className="table-cell">{acta.compromisos_count}</td>
                <td className="table-cell">
                  <button 
                    onClick={() => onSelectActa && onSelectActa(acta.id)}
                    className="detail-button"
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActasList;