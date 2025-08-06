import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import ActasList from './pages/ActasList';
import ActaDetail from './pages/ActaDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { authUtils } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'detail'
  const [selectedActaId, setSelectedActaId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      const isAuth = authUtils.isAuthenticated();
      setIsAuthenticated(isAuth);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('list'); // Resetear vista al hacer login
  };

  const handleAuthFail = () => {
    setIsAuthenticated(false);
    setCurrentView('list');
    setSelectedActaId(null);
  };

  const handleSelectActa = (actaId) => {
    setSelectedActaId(actaId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedActaId(null);
  };

  const renderProtectedContent = () => {
    if (currentView === 'detail' && selectedActaId) {
      return (
        <ActaDetail 
          actaId={selectedActaId} 
          onBack={handleBackToList} 
        />
      );
    }
    return <ActasList onSelectActa={handleSelectActa} />;
  };

  if (isLoading) {
    return (
      <div className="App">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Cargando aplicación...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <ProtectedRoute onAuthFail={handleAuthFail}>
          {renderProtectedContent()}
        </ProtectedRoute>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
