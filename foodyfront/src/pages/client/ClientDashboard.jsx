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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const role = localStorage.getItem('role');
      console.log('Token:', token);
      console.log('User:', user);
      if (token && user && role === 'CLIENT') {
        setIsAuthenticated(true);
        try {
          if (!user.userId) {
            throw new Error('ID utilisateur manquant dans les données de session');
          }
          
          const [ordersResponse, reservationsResponse] = await Promise.all([
            getOrdersByClient(user.userId, 'creeLe', 'desc', role),
            getReservationsByClient(user.userId, 'date', 'desc', role)
          ]);
          
          if (ordersResponse && ordersResponse.data) {
            setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
          }
          
          if (reservationsResponse && reservationsResponse.data) {
            setReservations(Array.isArray(reservationsResponse.data) ? reservationsResponse.data : []);
          }
          console.log('Orders Response:', ordersResponse.data);
          console.log('Reservations Response:', reservationsResponse.data);
          
        } catch (err) {
          console.error('Erreur lors du chargement des données:', err);
          
          let errorMessage = 'Erreur lors du chargement des données';
          
          if (err.response) {
            errorMessage = err.response.data?.message || 
                          `Erreur ${err.response.status}: ${err.response.statusText}`;
          } else if (err.request) {
            errorMessage = 'Impossible de contacter le serveur';
          } else {
            errorMessage = err.message;
          }
          
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Données de session invalides, redirection vers login');
        navigate('/login');
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await cancelReservation(reservationId, 'CLIENT');
      setReservations(reservations.map(res =>
        res.id === reservationId ? { ...res, status: 'Annulée' } : res
      ));
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de l\'annulation de la réservation');
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

  if (!isAuthenticated || loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
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
              <a href="/client" className="flex items-center text-gray-700" onClick={() => setActiveSection('dashboard')}>
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'commandes' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <a href="/client/commandes" className="flex items-center text-gray-700" onClick={() => setActiveSection('commandes')}>
                <ShoppingBag size={20} className="mr-3" />
                <span>Mes Commandes</span>
              </a>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'reservations' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <a href="/client/reservations" className="flex items-center text-gray-700" onClick={() => setActiveSection('reservations')}>
                <Calendar size={20} className="mr-3" />
                <span>Mes Réservations</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/client/profile" className="flex items-center text-gray-700">
                <User size={20} className="mr-3" />
                <span>Mon Profil</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                <LogOut size={20} className="mr-3" />
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord client</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
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
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
              <Calendar size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{reservations.length}</p>
          </div>
        </div>

        {/* Orders Section */}
        {activeSection === 'dashboard' || activeSection === 'commandes' ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des commandes</h2>
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
                        <span className="text-gray-500 text-sm ml-4">{new Date(order.creeLe).toLocaleString()}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.statut === 'EN_LIVRAISON' ? 'bg-blue-100 text-blue-800' : 
                        order.statut === 'LIVREE' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.statut}
                      </div>
                    </div>
                    <div className="p-4">
                      {/* Modified section for items - handle missing items gracefully */}
                      {order.items && order.items.length > 0 ? (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Articles commandés</h3>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{item.quantite}x {item.nom}</span>
                                <span>{item.prix * item.quantite} FCFA</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Détails de la commande</h3>
                          <p className="text-gray-600">Détails des articles non disponibles</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span>{order.prixTotal} FCFA</span>
                      </div>
                      
                      {order.adresseLivraison && (
                        <div className="mt-4 flex items-start">
                          <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Adresse de livraison</p>
                            <p>{order.adresseLivraison}</p>
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
              </div>
            )}
          </div>
        ) : null}

        {/* Reservations Section */}
        {activeSection === 'dashboard' || activeSection === 'reservations' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes réservations</h2>
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
                        <span className="text-gray-500 text-sm ml-4">
                          {reservation.dateReservation} à {reservation.heureReservation}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reservation.statut === 'Confirmée' ? 'bg-green-100 text-green-800' : 
                        reservation.statut === 'Annulée' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.statut || reservation.status}
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
                            <p className="font-medium">{reservation.demandesSpeciales}</p>
                          </div>
                        )}
                      </div>
                      {reservation.statut !== 'Annulée' && reservation.status !== 'Annulée' && (
                        <div className="mt-4 text-right">
                          <button 
                            onClick={() => handleCancelReservation(reservation.id)}
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
        ) : null}
      </div>
    </div>
  );
};

export default ClientDashboard;