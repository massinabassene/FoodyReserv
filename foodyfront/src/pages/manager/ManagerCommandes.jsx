import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home, Menu, Calendar, MessageSquare, Mail, LogOut, Edit, Search, Eye, X, Check, Users } from 'lucide-react';
import { getAllOrders, updateOrderStatus, deleteOrder, getLivreurs, assignDelivery, getOrdersByDelivery } from '../../api/api';

const ManagerCommandes = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [selectedLivreur, setSelectedLivreur] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCommande, setCurrentCommande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterLivreur, setFilterLivreur] = useState('Tous');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fetch orders and livreurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersResponse, livreursResponse] = await Promise.all([
          getAllOrders('creeLe', 'desc', 'MANAGER'),
          getLivreurs('MANAGER')
        ]);
        setCommandes(ordersResponse.data);
        setLivreurs(livreursResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter orders
  const filteredCommandes = commandes.filter(commande => {
    const clientSearch = commande.client?.nomUtilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const idSearch = commande.id.toString().includes(searchTerm);
    const matchesSearch = clientSearch || idSearch;
    const matchesStatut = filterStatut === 'Tous' || commande.statut === mapDisplayToStatut(filterStatut);
    const matchesLivreur = filterLivreur === 'Tous' || commande.livreur?.id.toString() === filterLivreur;
    return matchesSearch && matchesStatut && matchesLivreur;
  });

  // Mapper les statuts
  const mapStatutToDisplay = (statut) => {
    const statusMap = {
      'PRET': 'Prêt',
      'EN_PREPARATION': 'En préparation',
      'EN_LIVRAISON': 'En livraison',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return statusMap[statut] || statut;
  };

  const mapDisplayToStatut = (displayStatut) => {
    const statusMap = {
      'Prêt': 'PRET',
      'En préparation': 'EN_PREPARATION',
      'En livraison': 'EN_LIVRAISON',
      'Livrée': 'LIVREE',
      'Annulée': 'ANNULEE'
    };
    return statusMap[displayStatut] || displayStatut;
  };

  // Update order status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const apiStatus = mapDisplayToStatut(newStatus);
      await updateOrderStatus(id, apiStatus, 'MANAGER');
      setCommandes(commandes.map(commande => 
        commande.id === id ? { ...commande, statut: apiStatus } : commande
      ));
      if (currentCommande?.id === id) {
        setCurrentCommande({ ...currentCommande, statut: apiStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Assign livreur
  const handleAssignLivreur = async (commandeId, livreurId) => {
    try {
      await assignDelivery(commandeId, livreurId, 'MANAGER');
      setCommandes(commandes.map(commande => 
        commande.id === commandeId 
          ? { ...commande, livreur: livreurs.find(l => l.id === parseInt(livreurId)) } 
          : commande
      ));
      if (currentCommande?.id === commandeId) {
        setCurrentCommande({ 
          ...currentCommande, 
          livreur: livreurs.find(l => l.id === parseInt(livreurId)) 
        });
      }
    } catch (error) {
      console.error('Error assigning livreur:', error);
    }
  };

  // Delete order
  const handleDeleteOrder = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        await deleteOrder(id, 'MANAGER');
        setCommandes(commandes.filter(commande => commande.id !== id));
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  // Open order details
  const openCommandeDetails = (commande) => {
    setCurrentCommande({ ...commande });
    setSelectedLivreur(commande.livreur?.id?.toString() || '');
    setShowModal(true);
  };

  // Save order changes
  const saveCommandeChanges = async () => {
    try {
      await Promise.all([
        handleUpdateStatus(currentCommande.id, mapStatutToDisplay(currentCommande.statut)),
        selectedLivreur && handleAssignLivreur(currentCommande.id, selectedLivreur)
      ]);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const statutOptions = ['Prêt', 'En préparation', 'En livraison', 'Livrée', 'Annulée'];

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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commandes</h1>

        {/* Filters and Search */}
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
            <div className="flex items-center space-x-4">
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
                <label className="mr-2 text-gray-700">Livreur:</label>
                <select
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={filterLivreur}
                  onChange={(e) => setFilterLivreur(e.target.value)}
                >
                  <option value="Tous">Tous</option>
                  {livreurs.map(livreur => (
                    <option key={livreur.id} value={livreur.id}>{livreur.nomUtilisateur}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommandes.map((commande) => (
                  <tr key={commande.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{commande.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {commande.client?.nomUtilisateur || 'Client inconnu'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {commande.client?.telephone || 'Téléphone non disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(commande.creeLe)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{commande.prixTotal} FCFA</div>
                      <div className="text-sm text-gray-500">{commande.optionLivraison}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${commande.statut === 'LIVREE' ? 'bg-green-100 text-green-800' : 
                            commande.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' : 
                            commande.statut === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' : 
                            commande.statut === 'EN_PREPARATION' ? 'bg-blue-100 text-blue-800' : 
                            'bg-purple-100 text-purple-800'}`}
                      >
                        {mapStatutToDisplay(commande.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {commande.livreur?.nomUtilisateur || 'Non assigné'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openCommandeDetails(commande)}
                          className="text-indigo-600 hover:text-indigo-900 tooltip"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openCommandeDetails(commande)}
                          className="text-blue-600 hover:text-blue-900 tooltip"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCommandes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && currentCommande && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Commande #{currentCommande.id}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-medium">Nom:</span> {currentCommande.client?.nomUtilisateur || 'Non disponible'}</p>
                    <p><span className="font-medium">Email:</span> {currentCommande.client?.email || 'Non disponible'}</p>
                    <p><span className="font-medium">Téléphone:</span> {currentCommande.client?.telephone || 'Non disponible'}</p>
                    <p><span className="font-medium">Adresse:</span> {currentCommande.adresse || 'Non disponible'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informations commande</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><span className="font-medium">Date:</span> {formatDate(currentCommande.creeLe)}</p>
                    <p><span className="font-medium">Option livraison:</span> {currentCommande.optionLivraison}</p>
                    <p><span className="font-medium">Frais de livraison:</span> {currentCommande.fraisLivraison || 0} FCFA</p>
                    <p><span className="font-medium">Prix total:</span> {currentCommande.prixTotal} FCFA</p>
                    <p><span className="font-medium">Code confirmation:</span> {currentCommande.codeConfirmation}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Articles commandés</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Article</th>
                        <th className="text-right py-2">Prix unitaire</th>
                        <th className="text-right py-2">Quantité</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCommande.articles?.map((article, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2">{article.plat?.nom || 'Article inconnu'}</td>
                          <td className="text-right py-2">{article.plat?.prix || 0} FCFA</td>
                          <td className="text-right py-2">{article.quantite}</td>
                          <td className="text-right py-2">{(article.plat?.prix || 0) * article.quantite} FCFA</td>
                        </tr>
                      ))}
                      <tr className="border-t">
                        <td colSpan="3" className="py-2 text-right font-medium">Sous-total:</td>
                        <td className="py-2 text-right font-medium">{currentCommande.prixTotal - (currentCommande.fraisLivraison || 0)} FCFA</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="py-2 text-right font-medium">Frais de livraison:</td>
                        <td className="py-2 text-right font-medium">{currentCommande.fraisLivraison || 0} FCFA</td>
                      </tr>
                      <tr className="border-t font-bold">
                        <td colSpan="3" className="py-2 text-right">Total:</td>
                        <td className="py-2 text-right">{currentCommande.prixTotal} FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Statut de la commande</h3>
                <select
                  value={mapStatutToDisplay(currentCommande.statut)}
                  onChange={(e) => setCurrentCommande({ ...currentCommande, statut: mapDisplayToStatut(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {statutOptions.map((statut, index) => (
                    <option key={index} value={statut}>{statut}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Assigner un livreur</h3>
                <select
                  value={selectedLivreur}
                  onChange={(e) => setSelectedLivreur(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Aucun livreur</option>
                  {livreurs.map(livreur => (
                    <option key={livreur.id} value={livreur.id}>{livreur.nomUtilisateur}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleDeleteOrder(currentCommande.id)}
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
                  onClick={saveCommandeChanges}
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
    </div>
  );
};

export default ManagerCommandes;