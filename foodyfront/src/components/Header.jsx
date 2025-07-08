import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // ou tout autre icône
// import logo from '/images/logo.png'; // adapte le chemin au tien

const Header = ({ userRole, isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const navigateToPage = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/menu', label: 'Menu' },
        { path: '/login', label: 'Commander', disabled: true, title: 'Connectez-vous pour commander' },
        { path: '/login', label: 'Réserver', disabled: true, title: 'Connectez-vous pour réserver' },
        { path: '/apropos', label: 'À propos' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    if (userRole === 'CLIENT') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/menu', label: 'Menu' },
        { path: '/client/commander', label: 'Commander' },
        { path: '/client/reserver', label: 'Réserver' },
        { path: '/apropos', label: 'À propos' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    if (userRole === 'MANAGER') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/manager/commandes', label: 'Commandes' },
        { path: '/manager/reservations', label: 'Réservations' },
        { path: '/manager/menus', label: 'Gestion Menu' },
        { path: '/manager/clients', label: 'Clients' },
      ];
    }

    if (userRole === 'LIVREUR') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/livreur/commandes', label: 'Mes Livraisons' },
        { path: '/livreur/disponibilite', label: 'Disponibilité' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    return [
      { path: '/', label: 'Accueil' },
      { path: '/menu', label: 'Menu' },
      { path: '/apropos', label: 'À propos' },
      { path: '/contact', label: 'Contactez-Nous' },
    ];
  };

  const getProfilePath = () => {
    if (!isAuthenticated) return '/login';
    switch (userRole) {
      case 'CLIENT':
        return '/client';
      case 'MANAGER':
        return '/manager';
      case 'LIVREUR':
        return '/livreur';
      default:
        return '/login';
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <span className="font-bold text-xl text-yellow-600">FoodyReserv</span>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-6">
          {getNavigationLinks().map((item) => (
            <button
              key={item.label}
              onClick={() => !item.disabled && navigateToPage(item.path)}
              disabled={item.disabled}
              title={item.title || item.label}
              className={`relative font-medium transition-colors duration-300 pb-1 ${
                item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:text-yellow-500'
              }`}
            >
              {item.label}
              {!item.disabled && (
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-500 transition-all duration-300 hover:w-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Bouton Profil */}
        <button
          onClick={() => navigateToPage(getProfilePath())}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-300"
        >
          {isAuthenticated ? 'Dashboard' : 'Se Connecter'}
        </button>

        {/* Bouton Burger Mobile */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none ml-4">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Mobile */}
      {isMenuOpen && (
        <div className="bg-white shadow-md md:hidden px-6 py-4">
          <nav className="flex flex-col space-y-4">
            {getNavigationLinks().map((item) => (
              <button
                key={item.label}
                onClick={() => !item.disabled && navigateToPage(item.path)}
                disabled={item.disabled}
                title={item.title || item.label}
                className={`text-left font-medium text-lg ${
                  item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:text-yellow-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigateToPage(getProfilePath())}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition"
            >
              {isAuthenticated ? 'Dashboard' : 'Se Connecter'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
