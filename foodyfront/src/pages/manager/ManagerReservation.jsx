import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Edit, Archive, Search, Eye, X, Check, Users} from 'lucide-react';
import { 
  getAllReservations, 
  updateReservationStatus, 
  deleteReservation, 
  getReservationById 
} from '../../api/api';

const ManagerReservations = () => {
  const navigate = useNavigate();
  
  // Get user role from localStorage
  const role = JSON.parse(localStorage.getItem('user'))?.role;
  console.log(role)
  // États pour les réservations
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État pour le modal de détails/modification
  const [showModal, setShowModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [showArchived, setShowArchived] = useState(false);
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page d'accueil au lieu de la page de connexion
    navigate('/');
  };
  
  // Charger les réservations
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const response = await getAllReservations('creeLe', 'desc', role);
        setReservations(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des réservations:', error);
        setError('Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };
    
    loadReservations();
  }, [role]);
  console.log(reservations);
  // Fonction pour filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.client?.nomUtilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reservation.id.toString().includes(searchTerm);
    const matchesStatut = filterStatut === "Tous" || reservation.statut === filterStatut;
    const matchesArchived = showArchived ? true : reservation.statut !== 'ANNULEE';
    
    return matchesSearch && matchesStatut && matchesArchived;
  });
  
  // Fonction pour mettre à jour le statut d'une réservation
  const updateReservationStatusHandler = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus, role);
      setReservations(reservations.map(reservation => 
        reservation.id === id ? {...reservation, statut: newStatus} : reservation
      ));
      
      // Mettre à jour aussi la réservation courante si elle est ouverte dans le modal
      if (currentReservation && currentReservation.id === id) {
        setCurrentReservation({...currentReservation, statut: newStatus});
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };
  
  // Fonction pour supprimer une réservation
  const deleteReservationHandler = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }
    
    try {
      await deleteReservation(id, role);
      setReservations(reservations.filter(reservation => reservation.id !== id));
      
      // Fermer le modal si la réservation supprimée était ouverte
      if (currentReservation && currentReservation.id === id) {
        setShowModal(false);
        setCurrentReservation(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la réservation');
    }
  };
  
  // Fonction pour ouvrir le modal de détails
  const openReservationDetails = async (reservation) => {
    try {
      setModalLoading(true);
      const response = await getReservationById(reservation.id, role);
      setCurrentReservation(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      setError('Erreur lors du chargement des détails de la réservation');
    } finally {
      setModalLoading(false);
    }
  };
  
  // Fonction pour sauvegarder les modifications
  const saveReservationChanges = async () => {
    try {
      await updateReservationStatus(currentReservation.id, currentReservation.statut, role);
      setReservations(reservations.map(reservation => 
        reservation.id === currentReservation.id ? currentReservation : reservation
      ));
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des modifications');
    }
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  // Formater l'heure
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };
  
  // Options de statut pour les réservations
  const statutOptions = ["EN_ATTENTE", "CONFIRMEE", "TERMINEE", "ANNULEE"];
  const statutLabels = {
    "EN_ATTENTE": "En attente",
    "CONFIRMEE": "Confirmée",
    "TERMINEE": "Terminée",
    "ANNULEE": "Annulée"
  };
  
  // Fonction pour obtenir le label du statut
  const getStatutLabel = (statut) => {
    return statutLabels[statut] || statut;
  };
  
  // Fonction pour obtenir la classe CSS du statut
  const getStatutClass = (statut) => {
    switch(statut) {
      case 'CONFIRMEE': return 'bg-green-100 text-green-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'TERMINEE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Affichage du loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
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
              <a href="/manager" className="flex items-center text-gray-700">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/menu" className="flex items-center text-gray-700">
                <Menu size={20} className="mr-3" />
                <span>Gestion du menu</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/commandes" className="flex items-center text-gray-700">
                <ShoppingBag size={20} className="mr-3" />
                <span>Commandes</span>
              </a>
            </li>
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
              <a href="/manager/tables" className="flex items-center text-gray-700">
                <Users size={20} className="mr-3" />
                <span>Tables</span>
              </a>
            </li>
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
              <a href="/manager/reservations" className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3" />
                <span>Réservations</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/commentaires" className="flex items-center text-gray-700">
                <MessageSquare size={20} className="mr-3" />
                <span>Commentaires</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/messages" className="flex items-center text-gray-700">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Réservations</h1>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher par client ou numéro..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">Statut:</label>
                <select
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  <option value="Tous">Tous</option>
                  {statutOptions.map((statut, index) => (
                    <option key={index} value={statut}>{getStatutLabel(statut)}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showArchived"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="showArchived" className="ml-2 text-gray-700">
                  Afficher les réservations annulées
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className={`hover:bg-gray-50 ${reservation.statut === 'ANNULEE' ? 'bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{reservation.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.client ? `${reservation.client.nomUtilisateur}` : 'Client non défini'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.client?.telephone || 'Téléphone non défini'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.dateReservation ? new Date(reservation.dateReservation).toLocaleDateString('fr-FR') : 'Date non définie'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTime(reservation.heureReservation)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{reservation.tailleGroupe}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClass(reservation.statut)}`}>
                      {getStatutLabel(reservation.statut)}
                    </span>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openReservationDetails(reservation)}
                        className="text-indigo-600 hover:text-indigo-900 tooltip"
                        title="Voir détails"
                        disabled={modalLoading}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openReservationDetails(reservation)}
                        className="text-blue-600 hover:text-blue-900 tooltip"
                        title="Modifier"
                        disabled={modalLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteReservationHandler(reservation.id)}
                        className="text-red-600 hover:text-red-900 tooltip"
                        title="Supprimer"
                      >
                        <Archive size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Aucune réservation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal de détails/modification */}
      {showModal && currentReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Réservation #{currentReservation.id}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  value={currentReservation.client ? `${currentReservation.client.nomUtilisateur} ` : ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={currentReservation.client?.telephone || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={currentReservation.client?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={currentReservation.dateReservation || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input
                  type="time"
                  value={currentReservation.heureReservation || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes</label>
                <input
                  type="number"
                  value={currentReservation.tailleGroupe || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={currentReservation.statut}
                  onChange={(e) => setCurrentReservation({...currentReservation, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {statutOptions.map((statut, index) => (
                    <option key={index} value={statut}>{getStatutLabel(statut)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => deleteReservationHandler(currentReservation.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={saveReservationChanges}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Check size={20} className="mr-2" />
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReservations;