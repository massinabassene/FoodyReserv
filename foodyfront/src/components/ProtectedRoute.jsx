import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Composant ProtectedRoute qui vérifie l'authentification
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);
  
  if (loading) {
    // Afficher un écran de chargement pendant la vérification
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Afficher les composants enfants si l'utilisateur est authentifié
  return children;
};

export default ProtectedRoute;
