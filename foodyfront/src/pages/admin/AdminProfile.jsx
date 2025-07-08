import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Menu, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, User, Settings, Shield, Bell } from 'lucide-react';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: 'Administrateur',
    email: 'admin@foodyreserv.com',
    phone: '+221 77 000 00 00',
    role: 'Administrateur principal',
    lastLogin: new Date().toLocaleString('fr-FR'),
    avatar: '/images/admin-avatar.png' // Image par défaut
  });

  // Récupérer les données de l'administrateur depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.isAdmin) {
          setAdminData(prevData => ({
            ...prevData,
            name: parsedData.name || prevData.name,
            email: parsedData.email || prevData.email,
            phone: parsedData.phone || prevData.phone
          }));
        } else {
          // Si l'utilisateur n'est pas un administrateur, rediriger vers la page de connexion
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données administrateur:', error);
      }
    } else {
      // Si aucune donnée utilisateur n'est trouvée, rediriger vers la page de connexion
      navigate('/login');
    }
  }, [navigate]);

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer les données de session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger vers la page d'accueil
    navigate('/');
  };

  // Statistiques d'activité
  const activityStats = [
    { label: 'Commandes gérées', value: 156 },
    { label: 'Réservations confirmées', value: 89 },
    { label: 'Messages répondus', value: 42 },
    { label: 'Plats ajoutés', value: 23 }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
            <span className="text-green-700 text-2xl font-bold">FOODY</span>
            <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
          </div>
          </div>
          <p className="text-center text-gray-600 mt-2">Administration</p>
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
        
        <div className="absolute bottom-0 w-64 border-t p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profil Administrateur</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de profil */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                {adminData.avatar ? (
                  <img 
                    src={adminData.avatar} 
                    alt="Avatar administrateur" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=Admin";
                    }}
                  />
                ) : (
                  <User size={64} className="text-gray-400" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800">{adminData.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{adminData.role}</p>
              
              <div className="w-full mt-4 space-y-2">
                <div className="flex items-center text-gray-700">
                  <Mail size={16} className="mr-2" />
                  <span>{adminData.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Bell size={16} className="mr-2" />
                  <span>Dernière connexion: {adminData.lastLogin}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield size={16} className="mr-2" />
                  <span>Accès complet au système</span>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <button 
                  onClick={() => navigate('/admin/settings')} 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md flex items-center justify-center transition-all duration-300"
                >
                  <Settings size={16} className="mr-2" />
                  Paramètres du compte
                </button>
              </div>
              
              <div className="mt-4 w-full">
                <button 
                  onClick={handleLogout} 
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center transition-all duration-300"
                >
                  <LogOut size={16} className="mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
          
          {/* Statistiques d'activité */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Activité récente</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {activityStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
            
            <h3 className="font-semibold text-gray-700 mb-2">Actions récentes</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-800">Vous avez ajouté un nouveau plat au menu: <strong>Thiakry Spécial</strong></p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-gray-800">Vous avez confirmé la réservation <strong>#452</strong></p>
                <p className="text-xs text-gray-500">Il y a 4 heures</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-gray-800">Vous avez répondu au message de <strong>Aminata Seck</strong></p>
                <p className="text-xs text-gray-500">Il y a 1 jour</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-md">
                <p className="text-sm text-gray-800">Vous avez modifié le statut de la commande <strong>#1089</strong> à "Livrée"</p>
                <p className="text-xs text-gray-500">Il y a 1 jour</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="text-yellow-500 hover:text-yellow-600 font-medium">
                Voir toutes les activités
              </button>
            </div>
          </div>
          
          {/* Accès rapide */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1 lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Accès rapide</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/admin" className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300">
                <Home size={32} className="text-yellow-600 mb-2" />
                <span className="text-gray-800 font-medium">Tableau de bord</span>
              </a>
              <a href="/admin/menu" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300">
                <Menu size={32} className="text-green-600 mb-2" />
                <span className="text-gray-800 font-medium">Gestion du menu</span>
              </a>
              <a href="/admin/commandes" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300">
                <ShoppingBag size={32} className="text-blue-600 mb-2" />
                <span className="text-gray-800 font-medium">Commandes</span>
              </a>
              <a href="/admin/reservations" className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300">
                <Calendar size={32} className="text-purple-600 mb-2" />
                <span className="text-gray-800 font-medium">Réservations</span>
              </a>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Astuce :</strong> Vous pouvez accéder rapidement à toutes les fonctionnalités d'administration depuis le menu latéral. Pour revenir à l'interface client, utilisez le bouton de déconnexion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
