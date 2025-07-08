import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, User } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Données statiques pour le tableau de bord
  const dashboardStats = {
    totalCommandes: 45,
    commandesEnAttente: 12,
    totalReservations: 28,
    reservationsAujourdhui: 8,
    nouveauxMessages: 5,
    nouveauxCommentaires: 7
  };

  // Fonction pour naviguer vers les différentes sections
  const navigateToSection = (section) => {
    navigate(`/admin/${section}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
            <div>
              <span className="text-green-700 text-2xl font-bold">FOODY</span>
              <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
              <p className="text-center text-gray-600 mt-1">Administration</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin" className="flex items-center text-gray-700">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/menu" className="flex items-center text-gray-700">
                <Menu size={20} className="mr-3" />
                <span>Gestion du menu</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/commandes" className="flex items-center text-gray-700">
                <ShoppingBag size={20} className="mr-3" />
                <span>Commandes</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/reservations" className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3" />
                <span>Réservations</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/commentaires" className="flex items-center text-gray-700">
                <MessageSquare size={20} className="mr-3" />
                <span>Commentaires</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/messages" className="flex items-center text-gray-700">
                <Mail size={20} className="mr-3" />
                <span>Messages</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 border-t p-4 space-y-2">
          <a 
            href="/admin/profile"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300"
          >
            <User size={20} className="mr-3" />
            <span>Mon Profil</span>
          </a>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-red-500 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Statistiques des commandes */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Commandes</h2>
              <ShoppingBag size={24} className="text-yellow-500" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalCommandes}</p>
              </div>
              <div>
                <p className="text-gray-500">En attente</p>
                <p className="text-3xl font-bold text-yellow-500">{dashboardStats.commandesEnAttente}</p>
              </div>
            </div>
            <button 
              onClick={() => navigateToSection('commandes')}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md transition-all duration-300"
            >
              Voir toutes les commandes
            </button>
          </div>
          
          {/* Statistiques des réservations */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
              <Calendar size={24} className="text-green-600" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalReservations}</p>
              </div>
              <div>
                <p className="text-gray-500">Aujourd'hui</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.reservationsAujourdhui}</p>
              </div>
            </div>
            <button 
              onClick={() => navigateToSection('reservations')}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300"
            >
              Voir toutes les réservations
            </button>
          </div>
          
          {/* Statistiques des messages et commentaires */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Communications</h2>
              <MessageSquare size={24} className="text-blue-500" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Messages</p>
                <p className="text-3xl font-bold text-blue-500">{dashboardStats.nouveauxMessages}</p>
              </div>
              <div>
                <p className="text-gray-500">Commentaires</p>
                <p className="text-3xl font-bold text-purple-500">{dashboardStats.nouveauxCommentaires}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => navigateToSection('messages')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all duration-300"
              >
                Messages
              </button>
              <button 
                onClick={() => navigateToSection('commentaires')}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md transition-all duration-300"
              >
                Commentaires
              </button>
            </div>
          </div>
        </div>
        
        {/* Activité récente */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Nouvelle commande #1089</p>
                <p className="text-sm text-gray-500">Il y a 10 minutes</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Nouvelle réservation #452</p>
                <p className="text-sm text-gray-500">Il y a 25 minutes</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Nouveau message de contact</p>
                <p className="text-sm text-gray-500">Il y a 1 heure</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-purple-500 bg-purple-50">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Nouveau commentaire sur "Thieboudienne"</p>
                <p className="text-sm text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
