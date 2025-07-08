import React, { useState, useEffect } from 'react';
// Navigation serait normalement gérée par react-router-dom
import { ShoppingBag, Home, Menu, Calendar, MessageSquare, Mail, LogOut, Edit, Search, Eye, X, Check, Plus, Users, MapPin } from 'lucide-react';
import { getAllPlaces, createPlace, updatePlace, deletePlace, getUserRole } from '../../api/api';

const ManagerTables = () => {
  // Navigation serait normalement gérée par react-router-dom
  const navigate = (path) => {
    console.log('Navigation to:', path);
    // Ici vous utiliseriez react-router-dom dans votre application
  };
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisponibilite, setFilterDisponibilite] = useState('Tous');
  const [isEditMode, setIsEditMode] = useState(false);


   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page d'accueil au lieu de la page de connexion
    navigate('/');
  };
  // Fetch user role
  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  // Fetch places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await getAllPlaces();
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  // Filter places
  const filteredPlaces = places.filter(place => {
    const numeroSearch = place.numero.toString().includes(searchTerm);
    const emplacementSearch = place.emplacement && place.emplacement.toLowerCase().includes(searchTerm.toLowerCase());
    const capaciteSearch = place.capacite.toString().includes(searchTerm);
    
    const matchesSearch = numeroSearch || emplacementSearch || capaciteSearch;
    
    let matchesDisponibilite = true;
    if (filterDisponibilite === 'Disponible') {
      matchesDisponibilite = place.estDisponible;
    } else if (filterDisponibilite === 'Occupée') {
      matchesDisponibilite = !place.estDisponible;
    }
    
    return matchesSearch && matchesDisponibilite;
  });

  // Create new place
  const handleCreatePlace = async (placeData) => {
    try {
      const response = await createPlace(placeData, userRole);
      setPlaces([...places, response.data]);
      setShowModal(false);
      setCurrentPlace(null);
    } catch (error) {
      console.error('Error creating place:', error);
      alert('Erreur lors de la création de la table');
    }
  };

  // Update place
  const handleUpdatePlace = async (id, placeData) => {
    try {
      const response = await updatePlace(id, placeData, userRole);
      setPlaces(places.map(place => 
        place.id === id ? response.data : place
      ));
      setShowModal(false);
      setCurrentPlace(null);
    } catch (error) {
      console.error('Error updating place:', error);
      alert('Erreur lors de la mise à jour de la table');
    }
  };

  // Delete place
  const handleDeletePlace = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      try {
        await deletePlace(id, userRole);
        setPlaces(places.filter(place => place.id !== id));
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting place:', error);
        alert('Erreur lors de la suppression de la table');
      }
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setCurrentPlace({
      numero: '',
      capacite: '',
      emplacement: '',
      estDisponible: true
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (place) => {
    setCurrentPlace({ ...place });
    setIsEditMode(true);
    setShowModal(true);
  };

  // Save place changes
  const savePlaceChanges = async () => {
    if (!currentPlace.numero || !currentPlace.capacite) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const placeData = {
      numero: parseInt(currentPlace.numero),
      capacite: parseInt(currentPlace.capacite),
      emplacement: currentPlace.emplacement || null,
      estDisponible: currentPlace.estDisponible
    };

    if (isEditMode) {
      await handleUpdatePlace(currentPlace.id, placeData);
    } else {
      await handleCreatePlace(placeData);
    }
  };

  // Toggle availability
  const toggleAvailability = async (place) => {
    try {
      const updatedPlace = {
        ...place,
        estDisponible: !place.estDisponible
      };
      await updatePlace(place.id, updatedPlace, userRole);
      setPlaces(places.map(p => 
        p.id === place.id ? { ...p, estDisponible: !p.estDisponible } : p
      ));
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Erreur lors du changement de disponibilité');
    }
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
              <p className="text-center text-gray-600 mt-2">Manager</p>
            </div>
          </div>
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
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
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
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition-all duration-300">
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Tables</h1>
          <button
            onClick={openCreateModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Table
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher par numéro, emplacement ou capacité..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-gray-700">Disponibilité:</label>
              <select
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={filterDisponibilite}
                onChange={(e) => setFilterDisponibilite(e.target.value)}
              >
                <option value="Tous">Tous</option>
                <option value="Disponible">Disponible</option>
                <option value="Occupée">Occupée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tables List */}
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emplacement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlaces.map((place) => (
                  <tr key={place.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Table {place.numero}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users size={16} className="mr-2 text-gray-400" />
                        {place.capacite} personnes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        {place.emplacement || 'Non défini'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                          ${place.estDisponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        onClick={() => toggleAvailability(place)}
                      >
                        {place.estDisponible ? 'Disponible' : 'Occupée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(place)}
                          className="text-blue-600 hover:text-blue-900 tooltip"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePlace(place.id)}
                          className="text-red-600 hover:text-red-900 tooltip"
                          title="Supprimer"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPlaces.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucune table trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && currentPlace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? 'Modifier la Table' : 'Nouvelle Table'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de table *
                  </label>
                  <input
                    type="number"
                    value={currentPlace.numero}
                    onChange={(e) => setCurrentPlace({...currentPlace, numero: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ex: 1, 2, 3..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacité *
                  </label>
                  <input
                    type="number"
                    value={currentPlace.capacite}
                    onChange={(e) => setCurrentPlace({...currentPlace, capacite: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Nombre de personnes"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emplacement
                  </label>
                  <input
                    type="text"
                    value={currentPlace.emplacement || ''}
                    onChange={(e) => setCurrentPlace({...currentPlace, emplacement: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ex: Terrasse, Salle principale, Près de la fenêtre..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={currentPlace.estDisponible}
                    onChange={(e) => setCurrentPlace({...currentPlace, estDisponible: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="disponible" className="text-sm text-gray-700">
                    Table disponible
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Annuler
                </button>
                <button
                  onClick={savePlaceChanges}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Check size={20} className="mr-2" />
                  {isEditMode ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTables;