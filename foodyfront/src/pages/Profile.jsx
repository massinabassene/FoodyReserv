import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Calendar, LogOut, Edit, MapPin, Phone, Mail, Clock, Home } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '/images/avatar.png'
  });

  // Données fictives pour les commandes
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '10 Mai 2025',
      status: 'En livraison',
      total: 12500,
      items: [
        { name: 'Thieboudienne', quantity: 2, price: 3500 },
        { name: 'Yassa Poulet', quantity: 1, price: 3200 },
        { name: 'Jus de Bissap', quantity: 3, price: 800 }
      ],
      deliveryAddress: '123 Rue de Dakar, Sénégal',
      estimatedDelivery: '30-45 min'
    },
    {
      id: 'ORD-002',
      date: '5 Mai 2025',
      status: 'Livré',
      total: 8700,
      items: [
        { name: 'Mafé', quantity: 2, price: 3000 },
        { name: 'Pastels', quantity: 5, price: 500 }
      ],
      deliveryAddress: '123 Rue de Dakar, Sénégal',
      estimatedDelivery: 'Livré'
    }
  ]);

  // Données fictives pour les réservations
  const [reservations, setReservations] = useState([
    {
      id: 'RES-001',
      date: '15 Mai 2025',
      time: '19:30',
      guests: 4,
      status: 'Confirmée',
      specialRequests: 'Table près de la fenêtre'
    },
    {
      id: 'RES-002',
      date: '20 Mai 2025',
      time: '20:00',
      guests: 2,
      status: 'En attente',
      specialRequests: 'Anniversaire'
    }
  ]);

  // Charger les données utilisateur
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setIsAuthenticated(true);
      setUserData({
        name: user.name || 'Utilisateur',
        email: user.email || 'email@example.com',
        phone: user.phone || '+221 XX XXX XX XX',
        address: user.address || 'Dakar, Sénégal',
        avatar: '/images/avatar.png'
      });
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login');
    }
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page d'accueil au lieu de la page de connexion
    navigate('/');
  };
  
  // Fonction pour retourner à la page d'accueil
  const navigateToHome = () => {
    navigate('/');
  };

  // Fonction pour annuler une réservation
  const cancelReservation = (id) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'Annulée' } : res
    ));
  };

  // Animation de livraison pour les commandes en cours
  const DeliveryAnimation = ({ order }) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
      if (order.status === 'En livraison') {
        const interval = setInterval(() => {
          setPosition(prev => {
            if (prev >= 100) return 0;
            return prev + 1;
          });
        }, 100);
        return () => clearInterval(interval);
      }
    }, [order.status]);

    if (order.status !== 'En livraison') return null;

    return (
      <div className="mt-4 relative h-8 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 flex items-center"
          style={{ width: `${position}%` }}
        >
          <div className="absolute left-full transform -translate-x-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
            </svg>
          </div>
        </div>
        <div 
          className="absolute top-0 h-full transition-all duration-300"
          style={{ left: `${position}%` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 transform -translate-x-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
            <circle cx="9" cy="10" r="2" />
            <circle cx="15" cy="10" r="2" />
            <path d="M9 14h6" />
          </svg>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 md:mb-0 md:mr-6">
                <img 
                  src={userData.avatar || 'https://via.placeholder.com/100'} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-white text-opacity-80">{userData.email}</p>
              </div>
              <div className="ml-auto flex space-x-2">
                <button 
                  onClick={navigateToHome}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                >
                  <Home size={18} className="mr-2" />
                  Accueil
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                >
                  <LogOut size={18} className="mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button 
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${activeTab === 'profile' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} className="inline mr-2" />
                Mon Profil
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${activeTab === 'orders' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} className="inline mr-2" />
                Mes Commandes
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${activeTab === 'reservations' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('reservations')}
              >
                <Calendar size={18} className="inline mr-2" />
                Mes Réservations
              </button>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{userData.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                    >
                      <LogOut size={18} className="mr-2" />
                      Se déconnecter
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300">
                      <Edit size={18} className="mr-2" />
                      Modifier mes informations
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Commandes */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-6">Historique des commandes</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="font-medium">Commande #{order.id}</span>
                            <span className="text-gray-500 text-sm ml-4">{order.date}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'En livraison' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'Livré' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Articles commandés</h3>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>{item.price * item.quantity} FCFA</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>{order.total} FCFA</span>
                          </div>
                          <div className="mt-4 flex items-start">
                            <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Adresse de livraison</p>
                              <p>{order.deliveryAddress}</p>
                            </div>
                          </div>
                          {order.status === 'En livraison' && (
                            <div className="mt-4">
                              <div className="flex items-center">
                                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                <p className="text-sm">Temps estimé: <span className="font-medium">{order.estimatedDelivery}</span></p>
                              </div>
                              <DeliveryAnimation order={order} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Réservations */}
            {activeTab === 'reservations' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-semibold mb-6">Mes réservations</h2>
                {reservations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Vous n'avez pas encore de réservation.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="font-medium">Réservation #{reservation.id}</span>
                            <span className="text-gray-500 text-sm ml-4">{reservation.date} à {reservation.time}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === 'Confirmée' ? 'bg-green-100 text-green-800' : 
                            reservation.status === 'Annulée' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.status}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Nombre de personnes</p>
                              <p className="font-medium">{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}</p>
                            </div>
                            {reservation.specialRequests && (
                              <div>
                                <p className="text-sm text-gray-500">Demandes spéciales</p>
                                <p className="font-medium">{reservation.specialRequests}</p>
                              </div>
                            )}
                          </div>
                          {reservation.status !== 'Annulée' && (
                            <div className="mt-4 text-right">
                              <button 
                                onClick={() => cancelReservation(reservation.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all duration-300"
                              >
                                Annuler la réservation
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Profile;