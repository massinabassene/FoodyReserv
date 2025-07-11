import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Calendar, User, LogOut } from 'lucide-react';
import { createReservation, getReservationsByClient, cancelReservation } from '../../api/api';

const Reserver = () => {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    clientId: 0,
    date: '2025-07-11',
    heure: { hour: 12, minute: 0, second: 0, nano: 0 },
    tailleGroupe: 1
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('reservations');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem('user');
        const role = localStorage.getItem('role');

        if (!userString || role !== 'CLIENT') {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);
        const id = user.userId || user.id || user.clientId;
        if (!id) {
          setError('Utilisateur non identifié');
          setLoading(false);
          return;
        }
        setUserId(id);
        setCurrentUser(user);
        setReservation(prev => ({ ...prev, clientId: id }));

        const response = await getReservationsByClient(id, 'date', 'desc', 'CLIENT');
        setReservations(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

 const handleSubmitReservation = async () => {
  try {
    if (reservation.tailleGroupe < 1) {
      setError('Veuillez spécifier un nombre de personnes valide');
      return;
    }

    await createReservation(reservation, 'CLIENT');
    navigate('/client'); // Corrected to navigate to dashboard
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur lors de la réservation');
  }
};


  const handleCancelReservation = async (reservationId) => {
    try {
      await cancelReservation(reservationId, 'CLIENT');
      setReservations(reservations.map(res =>
        res.id === reservationId ? { ...res, statut: 'Annulée', status: 'Annulée' } : res
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'annulation de la réservation');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
              <button onClick={() => navigate('/client')} className="flex items-center text-gray-700 w-full text-left">
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
            <li className={`px-4 py-3 ${activeSection === 'profile' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
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
          <h1 className="text-3xl font-bold text-gray-800">Faire une réservation</h1>
          {currentUser && (
            <div className="text-right">
              <p className="text-gray-600">Bienvenue,</p>
              <p className="font-semibold text-gray-800">{currentUser.nom || currentUser.prenom || 'Client'}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Reservation Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar size={24} className="mr-2 text-green-500" />
            Détails de la réservation
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={reservation.date}
                onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure</label>
              <input
                type="time"
                value={`${reservation.heure.hour.toString().padStart(2, '0')}:${reservation.heure.minute.toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hour, minute] = e.target.value.split(':').map(Number);
                  setReservation({
                    ...reservation,
                    heure: { ...reservation.heure, hour, minute }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de personnes</label>
              <input
                type="number"
                min="1"
                value={reservation.tailleGroupe}
                onChange={(e) => setReservation({ ...reservation, tailleGroupe: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleSubmitReservation}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
            >
              Confirmer la réservation
            </button>
          </div>
        </div>

        {/* Reservation History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des réservations</h2>
          {reservations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Vous n'avez pas encore de réservation.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map(reservation => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reserver;