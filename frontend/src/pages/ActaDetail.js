import React, { useState, useEffect } from 'react';
import { actasService, gestionesService } from '../services/api';
import { authUtils } from '../services/auth';
import '../styles/ActaDetail.css';

const ActaDetail = ({ actaId, onBack }) => {
  const [acta, setActa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGestionModal, setShowGestionModal] = useState(false);
  const [selectedCompromiso, setSelectedCompromiso] = useState('');
  const [gestionData, setGestionData] = useState({
    descripcion: '',
    archivo: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');

  const user = authUtils.getUser();

  const openPDF = async (pdfPath) => {
    try {
      console.log('=== PDF Opening Debug ===');
      console.log('Original pdfPath:', pdfPath);
      
      const token = authUtils.getToken();
      console.log('Token exists:', !!token);
      console.log('Token length:', token ? token.length : 0);
      console.log('Token preview:', token ? token.substring(0, 10) + '...' : 'NO TOKEN');
      
      if (!token) {
        alert('No hay token de autenticación. Por favor, inicia sesión de nuevo.');
        return;
      }
      
      // Verificar que el token sea válido haciendo una petición de prueba
      console.log('Testing token validity...');
      try {
        const testResponse = await fetch('http://localhost:8000/api/actas/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        console.log('Token test response status:', testResponse.status);
        if (testResponse.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          return;
        }
        if (!testResponse.ok) {
          console.error('Token test failed with status:', testResponse.status);
        }
      } catch (tokenTestError) {
        console.error('Error testing token:', tokenTestError);
      }
      
      // Limpiar la ruta del PDF - manejar tanto URLs completas como rutas relativas
      let cleanPath = pdfPath;
      
      // Si viene una URL completa, extraer solo la parte del archivo
      if (cleanPath.startsWith('http://localhost:8000/media/')) {
        cleanPath = cleanPath.replace('http://localhost:8000/media/', '');
      } else if (cleanPath.startsWith('/media/')) {
        cleanPath = cleanPath.replace('/media/', '');
      }
      
      console.log('Path cleaning process:');
      console.log('- Original:', pdfPath);
      console.log('- After cleaning:', cleanPath);
      
      console.log('Clean path:', cleanPath);
      const url = `http://localhost:8000/api/media/${cleanPath}`;
      console.log('Full URL:', url);
      
      console.log('Making fetch request...');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      console.log('Response received!');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        console.log('Response OK, getting blob...');
        const blob = await response.blob();
        console.log('Blob created!');
        console.log('Blob size:', blob.size);
        console.log('Blob type:', blob.type);
        
        if (blob.size === 0) {
          alert('El archivo PDF está vacío');
          return;
        }
        
        console.log('Creating object URL...');
        const objectUrl = window.URL.createObjectURL(blob);
        console.log('Object URL created:', objectUrl);
        
        console.log('Opening new window...');
        const newWindow = window.open(objectUrl, '_blank');
        
        if (!newWindow) {
          console.error('Popup blocked - trying alternative method');
          // Alternative: create download link
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = cleanPath.split('/').pop() || 'document.pdf';
          a.click();
        }
        
        // Limpiar el URL después de un tiempo para liberar memoria
        setTimeout(() => {
          console.log('Revoking object URL...');
          window.URL.revokeObjectURL(objectUrl);
        }, 1000);
      } else {
        console.error('Response not OK');
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        alert(`Error al abrir el PDF: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('=== PDF Opening Error ===');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`Error al abrir el PDF: ${error.message}`);
    }
  };

  useEffect(() => {
    loadActaDetail();
  }, [actaId]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (showGestionModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showGestionModal]);

  // Función para cerrar modal y limpiar datos
  const closeModal = () => {
    setShowGestionModal(false);
    setSelectedCompromiso('');
    setGestionData({ 
      descripcion: '', 
      archivo: null 
    });
    setFileError('');
  };

  const loadActaDetail = async () => {
    try {
      setLoading(true);
      const data = await actasService.getActaDetail(actaId);
      setActa(data);
    } catch (error) {
      setError('Error al cargar el detalle del acta');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'pendiente': return 'estado-badge estado-pendiente';
      case 'en_progreso': return 'estado-badge estado-en-progreso';
      case 'completada': return 'estado-badge estado-completada';
      default: return 'estado-badge estado-default';
    }
  };

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const validExtensions = ['.pdf', '.jpg', '.jpeg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validar por tipo MIME
    if (!validTypes.includes(file.type)) {
      return 'Tipo de archivo no válido. Solo se permiten archivos PDF, JPG o JPEG.';
    }

    // Validar por extensión (seguridad adicional)
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(extension)) {
      return 'Extensión de archivo no válida. Solo se permiten archivos .pdf, .jpg o .jpeg.';
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `El archivo es demasiado grande (${sizeMB} MB). El tamaño máximo permitido es 5MB.`;
    }

    // Validar que no esté vacío
    if (file.size === 0) {
      return 'El archivo está vacío. Por favor selecciona un archivo válido.';
    }

    return null; // No hay errores
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (file) {
      const validationError = validateFile(file);
      
      if (validationError) {
        setFileError(validationError);
        e.target.value = ''; // Limpiar el input
        setGestionData({ ...gestionData, archivo: null });
        return;
      }

      setGestionData({ ...gestionData, archivo: file });
    } else {
      setGestionData({ ...gestionData, archivo: null });
    }
  };

  const handleSubmitGestion = async (e) => {
    e.preventDefault();
    if (!selectedCompromiso || !gestionData.descripcion) {
      alert('Descripción y compromiso son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      await gestionesService.createGestion({
        compromiso: selectedCompromiso,
        descripcion: gestionData.descripcion,
        archivo: gestionData.archivo
      });

      alert('Gestión creada exitosamente');
      closeModal();
      loadActaDetail(); // Recargar para ver cambios
    } catch (error) {
      alert('Error al crear la gestión');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Cargando detalle del acta...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={onBack} className="back-button">Volver al listado</button>
      </div>
    );
  }

  return (
    <div className="acta-detail-container">
      <div className="detail-header">
        <button onClick={onBack} className="back-button">← Volver al listado</button>
        <div className="user-info">
          <span className="user-email">Usuario: {user?.email}</span>
        </div>
      </div>

      <div className="acta-info">
        <h1 className="acta-title">{acta.titulo}</h1>
        <div className="acta-meta">
          <span className={getEstadoClass(acta.estado)}>
            {acta.estado.replace('_', ' ').toUpperCase()}
          </span>
          <span className="acta-date">Fecha: {formatDate(acta.fecha)}</span>
        </div>
      </div>

      {acta.pdf && (
        <div className="pdf-section">
          <h2>Documento PDF</h2>
          <button
            onClick={() => openPDF(acta.pdf)}
            className="pdf-link"
          >
            Ver PDF del acta
          </button>
        </div>
      )}

      <div className="compromisos-section">
        <div className="section-header">
          <h2>Compromisos ({acta.compromisos.length})</h2>
          <button
            onClick={() => setShowGestionModal(true)}
            className="add-gestion-button"
          >
            Agregar Gestión
          </button>
        </div>

        {acta.compromisos.length === 0 ? (
          <p className="no-data">No hay compromisos registrados para esta acta.</p>
        ) : (
          <div className="compromisos-list">
            {acta.compromisos.map((compromiso) => (
              <div key={compromiso.id} className="compromiso-card">
                <h3 className="compromiso-title">Compromiso #{compromiso.id}</h3>
                <p className="compromiso-description">{compromiso.descripcion}</p>
                <div className="compromiso-meta">
                  <span className="responsable">Responsable: {compromiso.responsable}</span>
                  <span className="fecha-limite">Fecha límite: {formatDate(compromiso.fecha_limite)}</span>
                </div>
                
                {/* Gestiones del compromiso */}
                {compromiso.gestiones && compromiso.gestiones.length > 0 && (
                  <div className="gestiones-section">
                    <h4 className="gestiones-title">
                      Gestiones ({compromiso.gestiones.length})
                    </h4>
                    <div className="gestiones-list">
                      {compromiso.gestiones.map((gestion) => (
                        <div key={gestion.id} className="gestion-item">
                          <div className="gestion-header">
                            <span className="gestion-date">
                              {formatDate(gestion.fecha)}
                            </span>
                            <span className="gestion-user">
                              por {gestion.usuario_email}
                            </span>
                          </div>
                          <p className="gestion-description">
                            {gestion.descripcion}
                          </p>
                          {gestion.archivo && (
                            <button
                              onClick={() => openPDF(gestion.archivo)}
                              className="gestion-file-link"
                            >
                              📎 Ver archivo adjunto
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Agregar Gestión */}
      {showGestionModal && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar Nueva Gestión</h2>
              <button 
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitGestion} className="modal-form">
              <div className="form-group">
                <label className="form-label">Compromiso:</label>
                <select
                  value={selectedCompromiso}
                  onChange={(e) => setSelectedCompromiso(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar compromiso</option>
                  {acta.compromisos.map((compromiso) => (
                    <option key={compromiso.id} value={compromiso.id}>
                      Compromiso #{compromiso.id}: {compromiso.descripcion.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción:</label>
                <textarea
                  value={gestionData.descripcion}
                  onChange={(e) => setGestionData({ ...gestionData, descripcion: e.target.value })}
                  className="form-textarea"
                  rows="4"
                  required
                  placeholder="Describe la gestión realizada..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Archivo adjunto (opcional):</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={`form-file ${fileError ? 'file-error' : ''}`}
                  accept=".pdf,.jpg,.jpeg"
                />
                <small className="file-help">Solo PDF, JPG o JPEG, máximo 5MB</small>
                {fileError && (
                  <div className="file-error-message">
                    ⚠️ {fileError}
                  </div>
                )}
                {gestionData.archivo && !fileError && (
                  <div className="file-success-message">
                    ✅ Archivo seleccionado: {gestionData.archivo.name} 
                    ({(gestionData.archivo.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  disabled={submitting}
                  className="submit-button"
                >
                  {submitting ? 'Creando...' : 'Crear Gestión'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActaDetail;