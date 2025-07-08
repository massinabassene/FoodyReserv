import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Navigation vers la page de connexion
  const navigateToLoginPage = () => {
    navigate('/login');
  };

  // Navigation vers la page de profil
  const navigateToProfilePage = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-green-700 text-2xl font-bold">FOODY</span>
            <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
            <img src="/images/logo.png" className="h-10 ml-2" alt="Logo" />
          </a>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="font-medium hover:text-yellow-500 transition-colors">Accueil</a>
          <a href="/menu" className="font-medium hover:text-yellow-500 transition-colors">Menu</a>
          <a href="/commander" className="font-medium hover:text-yellow-500 transition-colors">Commander !</a>
          <a href="/reserver" className="font-medium hover:text-yellow-500 transition-colors">Réserver</a>
          <a href="/apropos" className="font-medium hover:text-yellow-500 transition-colors">À propos</a>
          <a href="/contact" className="font-medium hover:text-yellow-500 transition-colors">Contactez-Nous</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
          </button>
          {isAuthenticated ? (
            <button 
              onClick={navigateToProfilePage}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              PROFIL
            </button>
          ) : (
            <button 
              onClick={navigateToLoginPage}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-600 transition-colors"
            >
              SE CONNECTER
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
