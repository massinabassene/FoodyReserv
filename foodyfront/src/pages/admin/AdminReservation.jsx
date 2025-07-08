import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Edit, Archive, Search, Eye, X, Check } from 'lucide-react';

const AdminReservations = () => {
  const navigate = useNavigate();
  
  // Données statiques pour les réservations
  const [reservations, setReservations] = useState([
    {
      id: 1,
      client: "Moussa Diallo",
      telephone: "77 555 66 77",
      email: "moussa.diallo@example.com",
      date: "2025-05-20T19:30:00",
      nombrePersonnes: 4,
      occasion: "Anniversaire",
      statut: "Confirmée",
      notes: "Table près de la fenêtre si possible",
      archived: false
    },
    {
      id: 2,
      client: "Aïda Sarr",
      telephone: "76 123 45 67",
      email: "aida.sarr@example.com",
      date: "2025-05-19T20:00:00",
      nombrePersonnes: 2,
      occasion: "Dîner romantique",
      statut: "En attente",
      notes: "Table calme souhaitée",
      archived: false
    },
    {
      id: 3,
      client: "Omar Seck",
      telephone: "70 987 65 43",
      email: "omar.seck@example.com",
      date: "2025-05-18T13:00:00",
      nombrePersonnes: 6,
      occasion: "Déjeuner d'affaires",
      statut: "Terminée",
      notes: "Prévoir un menu d'affaires",
      archived: false
    },
    {
      id: 4,
      client: "Rokhaya Ndiaye",
      telephone: "78 444 55 66",
      email: "rokhaya.ndiaye@example.com",
      date: "2025-05-17T19:00:00",
      nombrePersonnes: 8,
      occasion: "Fête de famille",
      statut: "Annulée",
      notes: "Client a annulé pour cause de maladie",
      archived: true
    }
  ]);
  
  // État pour le modal de détails/modification
  const [showModal, setShowModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [showArchived, setShowArchived] = useState(false);
  
  // Fonction pour filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reservation.id.toString().includes(searchTerm);
    const matchesStatut = filterStatut === "Tous" || reservation.statut === filterStatut;
    const matchesArchived = showArchived ? true : !reservation.archived;
    
    return matchesSearch && matchesStatut && matchesArchived;
  });
  
  // Fonction pour mettre à jour le statut d'une réservation
  const updateReservationStatus = (id, newStatus) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? {...reservation, statut: newStatus} : reservation
    ));
  };
  
  // Fonction pour archiver/désarchiver une réservation
  const toggleArchiveReservation = (id) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? {...reservation, archived: !reservation.archived} : reservation
    ));
  };
  
  // Fonction pour ouvrir le modal de détails
  const openReservationDetails = (reservation) => {
    setCurrentReservation({...reservation});
    setShowModal(true);
  };
  
  // Fonction pour sauvegarder les modifications
  const saveReservationChanges = () => {
    setReservations(reservations.map(reservation => 
      reservation.id === currentReservation.id ? currentReservation : reservation
    ));
    setShowModal(false);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Options de statut pour les réservations
  const statutOptions = ["En attente", "Confirmée", "Terminée", "Annulée"];
  
  // Options pour les occasions
  const occasionOptions = ["Anniversaire", "Dîner romantique", "Déjeuner d'affaires", "Fête de famille", "Autre"];

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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
                    <option key={index} value={statut}>{statut}</option>
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
                  Afficher les réservations archivées
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className={`hover:bg-gray-50 ${reservation.archived ? 'bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{reservation.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.client}</div>
                    <div className="text-sm text-gray-500">{reservation.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{reservation.nombrePersonnes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.occasion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${reservation.statut === 'Confirmée' ? 'bg-green-100 text-green-800' : 
                        reservation.statut === 'Annulée' ? 'bg-red-100 text-red-800' : 
                        reservation.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openReservationDetails(reservation)}
                        className="text-indigo-600 hover:text-indigo-900 tooltip"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openReservationDetails(reservation)}
                        className="text-blue-600 hover:text-blue-900 tooltip"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => toggleArchiveReservation(reservation.id)}
                        className={`${reservation.archived ? 'text-green-600 hover:text-green-900' : 'text-amber-600 hover:text-amber-900'} tooltip`}
                        title={reservation.archived ? 'Désarchiver' : 'Archiver'}
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
                  value={currentReservation.client}
                  onChange={(e) => setCurrentReservation({...currentReservation, client: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={currentReservation.telephone}
                  onChange={(e) => setCurrentReservation({...currentReservation, telephone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={currentReservation.email}
                  onChange={(e) => setCurrentReservation({...currentReservation, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
                <input
                  type="datetime-local"
                  value={currentReservation.date.slice(0, 16)}
                  onChange={(e) => setCurrentReservation({...currentReservation, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes</label>
                <input
                  type="number"
                  min="1"
                  value={currentReservation.nombrePersonnes}
                  onChange={(e) => setCurrentReservation({...currentReservation, nombrePersonnes: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                <select
                  value={currentReservation.occasion}
                  onChange={(e) => setCurrentReservation({...currentReservation, occasion: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {occasionOptions.map((occasion, index) => (
                    <option key={index} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={currentReservation.statut}
                  onChange={(e) => setCurrentReservation({...currentReservation, statut: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {statutOptions.map((statut, index) => (
                    <option key={index} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={currentReservation.notes}
                onChange={(e) => setCurrentReservation({...currentReservation, notes: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => toggleArchiveReservation(currentReservation.id)}
                className={`px-4 py-2 rounded-md ${
                  currentReservation.archived 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {currentReservation.archived ? 'Désarchiver' : 'Archiver'}
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

export default AdminReservations;
