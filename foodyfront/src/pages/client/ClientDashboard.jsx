import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home, ShoppingBag, Calendar, LogOut, MapPin, Clock } from 'lucide-react';
import { getOrdersByClient, getReservationsByClient, cancelReservation } from '../../api/api';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        
        console.log('Token:', token ? 'Présent' : 'Absent');
        console.log('User string:', userString);
        console.log('Role:', role);

        // Vérifications détaillées
        if (!token) {
          console.log('Token manquant');
          navigate('/login');
          return;
        }

        if (!userString) {
          console.log('Données utilisateur manquantes');
          navigate('/login');
          return;
        }
        // Vérification robuste du rôle
        const cleanRole = role?.trim()?.toUpperCase();
        if (!cleanRole || cleanRole !== 'CLIENT') {
          console.log('Rôle incorrect. Reçu:', JSON.stringify(role), 'Nettoyé:', cleanRole);
          navigate('/login');
          return;
        }

        let user;
        try {
          user = JSON.parse(userString);
          console.log('User parsed:', user);
        } catch (parseError) {
          console.error('Erreur lors du parsing des données utilisateur:', parseError);
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        // Vérifier que l'utilisateur a un ID (peut être userId, id, ou autre)
        const userId = user.userId || user.id || user.clientId;
        if (!userId) {
          console.error('ID utilisateur manquant dans les données:', user);
          setError('ID utilisateur manquant dans les données de session');
          // Ne pas rediriger immédiatement, permettre à l'utilisateur de voir l'erreur
          setLoading(false);
          return;
        }

        console.log('ID utilisateur trouvé:', userId);
        setCurrentUser({ ...user, userId });
        setIsAuthenticated(true);

        // Charger les données
        try {
          const [ordersResponse, reservationsResponse] = await Promise.all([
            getOrdersByClient(userId, 'creeLe', 'desc', role),
            getReservationsByClient(userId, 'date', 'desc', role)
          ]);
          
          console.log('Orders Response:', ordersResponse);
          console.log('Reservations Response:', reservationsResponse);
          
          // Traitement des commandes
          if (ordersResponse?.data) {
            const ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
            setOrders(ordersData);
            console.log('Commandes chargées:', ordersData.length);
          } else {
            console.log('Aucune donnée de commande reçue');
            setOrders([]);
          }
          
          // Traitement des réservations
          if (reservationsResponse?.data) {
            const reservationsData = Array.isArray(reservationsResponse.data) ? reservationsResponse.data : [];
            setReservations(reservationsData);
            console.log('Réservations chargées:', reservationsData.length);
          } else {
            console.log('Aucune donnée de réservation reçue');
            setReservations([]);
          }
          
        } catch (apiError) {
          console.error('Erreur API:', apiError);
          
          let errorMessage = 'Erreur lors du chargement des données';
          
          if (apiError.response) {
            const status = apiError.response.status;
            const data = apiError.response.data;
            
            if (status === 401) {
              console.log('Token expiré ou invalide');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('role');
              navigate('/login');
              return;
            } else if (status === 403) {
              errorMessage = 'Accès non autorisé';
            } else if (status === 404) {
              errorMessage = 'Ressource non trouvée';
            } else {
              errorMessage = data?.message || `Erreur ${status}: ${apiError.response.statusText}`;
            }
          } else if (apiError.request) {
            errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
          } else {
            errorMessage = apiError.message;
          }
          
          setError(errorMessage);
        }
        
      } catch (globalError) {
        console.error('Erreur globale:', globalError);
        setError('Une erreur inattendue s\'est produite');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await cancelReservation(reservationId, 'CLIENT');
      setReservations(reservations.map(res =>
        res.id === reservationId ? { ...res, statut: 'Annulée', status: 'Annulée' } : res
      ));
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation de la réservation');
    }
  };

  const DeliveryAnimation = ({ order }) => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
      if (order.statut === 'EN_LIVRAISON') {
        const interval = setInterval(() => {
          setPosition(prev => prev >= 100 ? 0 : prev + 1);
        }, 100);
        return () => clearInterval(interval);
      }
    }, [order.statut]);

    if (order.statut !== 'EN_LIVRAISON') return null;

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
      </div>
    );
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne pas afficher le contenu
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-center text-gray-600 mt-1">Client</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            <li className={`px-4 py-3 ${activeSection === 'dashboard' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => setActiveSection('dashboard')} className="flex items-center text-gray-700 w-full text-left">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </button>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'commandes' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => navigate('/client/commandes')} className="flex items-center text-gray-700 w-full text-left">
                <ShoppingBag size={20} className="mr-3" />
                <span>Mes Commandes</span>
              </button>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'reservations' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => navigate('/client/reservations')} className="flex items-center text-gray-700 w-full text-left">
                <Calendar size={20} className="mr-3" />
                <span>Mes Réservations</span>
              </button>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <button onClick={() => navigate('/client/profile')} className="flex items-center text-gray-700 w-full text-left">
                <User size={20} className="mr-3" />
                <span>Mon Profil</span>
              </button>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 w-full text-left">
                <LogOut size={20} className="mr-3" />
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord client</h1>
          {currentUser && (
            <div className="text-right">
              <p className="text-gray-600">Bienvenue,</p>
              <p className="font-semibold text-gray-800">{currentUser.nom || currentUser.prenom || 'Client'}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Commandes</h2>
              <ShoppingBag size={24} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total des commandes</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
              <Calendar size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{reservations.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total des réservations</p>
          </div>
        </div>

        {/* Orders Section */}
        {(activeSection === 'dashboard' || activeSection === 'commandes') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {activeSection === 'commandes' ? 'Mes commandes' : 'Dernières commandes'}
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors duration-300">
                  Passer une commande
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.slice(0, activeSection === 'dashboard' ? 3 : orders.length).map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="font-medium">Commande #{order.id}</span>
                        <span className="text-gray-500 text-sm ml-4">
                          {new Date(order.creeLe).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.statut === 'EN_LIVRAISON' ? 'bg-blue-100 text-blue-800' : 
                        order.statut === 'LIVREE' ? 'bg-green-100 text-green-800' : 
                        order.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.statut}
                      </div>
                    </div>
                    <div className="p-4">
                      {order.items && order.items.length > 0 ? (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Articles commandés</h3>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.quantite}x {item.nom}</span>
                                <span className="font-medium">{(item.prix * item.quantite).toLocaleString()} FCFA</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Détails de la commande</h3>
                          <p className="text-gray-600 text-sm">Détails des articles non disponibles</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span>{order.prixTotal?.toLocaleString()} FCFA</span>
                      </div>
                      
                      {order.adresseLivraison && (
                        <div className="mt-4 flex items-start">
                          <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Adresse de livraison</p>
                            <p className="text-sm">{order.adresseLivraison}</p>
                          </div>
                        </div>
                      )}
                      
                      {order.statut === 'EN_LIVRAISON' && (
                        <div className="mt-4">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-500 mr-2" />
                            <p className="text-sm">Temps estimé: <span className="font-medium">{order.estimatedDelivery || '30-45 min'}</span></p>
                          </div>
                          <DeliveryAnimation order={order} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {activeSection === 'dashboard' && orders.length > 3 && (
                  <div className="text-center">
                    <button 
                      onClick={() => setActiveSection('commandes')}
                      className="text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Voir toutes les commandes ({orders.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reservations Section */}
        {(activeSection === 'dashboard' || activeSection === 'reservations') && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {activeSection === 'reservations' ? 'Mes réservations' : 'Dernières réservations'}
            </h2>
            {reservations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Vous n'avez pas encore de réservation.</p>
                <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors duration-300">
                  Faire une réservation
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.slice(0, activeSection === 'dashboard' ? 3 : reservations.length).map((reservation) => (
                  <div key={reservation.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <span className="font-medium">Réservation #{reservation.id}</span>
                        <span className="text-gray-500 text-sm ml-4">
                          {reservation.dateReservation} à {reservation.heureReservation}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        (reservation.statut === 'Confirmée' || reservation.status === 'Confirmée') ? 'bg-green-100 text-green-800' : 
                        (reservation.statut === 'Annulée' || reservation.status === 'Annulée') ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.statut || reservation.status || 'En attente'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nombre de personnes</p>
                          <p className="font-medium">
                            {reservation.nombrePersonnes} {reservation.nombrePersonnes > 1 ? 'personnes' : 'personne'}
                          </p>
                        </div>
                        {reservation.demandesSpeciales && (
                          <div>
                            <p className="text-sm text-gray-500">Demandes spéciales</p>
                            <p className="font-medium text-sm">{reservation.demandesSpeciales}</p>
                          </div>
                        )}
                      </div>
                      {reservation.statut !== 'Annulée' && reservation.status !== 'Annulée' && (
                        <div className="mt-4 text-right">
                          <button 
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm"
                          >
                            Annuler la réservation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {activeSection === 'dashboard' && reservations.length > 3 && (
                  <div className="text-center">
                    <button 
                      onClick={() => setActiveSection('reservations')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Voir toutes les réservations ({reservations.length})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;