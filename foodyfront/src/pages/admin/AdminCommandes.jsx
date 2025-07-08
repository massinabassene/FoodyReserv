import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Edit, Archive, Search, Eye, X, Check } from 'lucide-react';

const AdminCommandes = () => {
  const navigate = useNavigate();
  
  // Données statiques pour les commandes
  const [commandes, setCommandes] = useState([
    {
      id: 1,
      client: "Amadou Diop",
      telephone: "77 123 45 67",
      adresse: "Sacré-Cœur 3, Villa 123, Dakar",
      date: "2025-05-18T10:30:00",
      statut: "En attente",
      paiement: "À la livraison",
      montantTotal: 9700,
      items: [
        { id: 1, nom: "Thieboudienne", prix: 3500, quantite: 2 },
        { id: 4, nom: "Pastels", prix: 1500, quantite: 1 },
        { id: 5, nom: "Thiakry", prix: 1200, quantite: 1 }
      ],
      archived: false
    },
    {
      id: 2,
      client: "Fatou Ndiaye",
      telephone: "76 987 65 43",
      adresse: "Mermoz, Avenue Cheikh Anta Diop, Dakar",
      date: "2025-05-18T11:15:00",
      statut: "En préparation",
      paiement: "Orange Money",
      montantTotal: 6400,
      items: [
        { id: 2, nom: "Yassa Poulet", prix: 3200, quantite: 2 }
      ],
      archived: false
    },
    {
      id: 3,
      client: "Ibrahima Sow",
      telephone: "70 555 44 33",
      adresse: "Point E, Rue 10, Dakar",
      date: "2025-05-18T09:45:00",
      statut: "Livrée",
      paiement: "Wave",
      montantTotal: 7700,
      items: [
        { id: 3, nom: "Mafé", prix: 3000, quantite: 1 },
        { id: 2, nom: "Yassa Poulet", prix: 3200, quantite: 1 },
        { id: 5, nom: "Thiakry", prix: 1500, quantite: 1 }
      ],
      archived: false
    },
    {
      id: 4,
      client: "Marie Faye",
      telephone: "78 111 22 33",
      adresse: "Almadies, Résidence Les Cocotiers, Dakar",
      date: "2025-05-17T19:30:00",
      statut: "Annulée",
      paiement: "Carte bancaire",
      montantTotal: 4700,
      items: [
        { id: 3, nom: "Mafé", prix: 3000, quantite: 1 },
        { id: 4, nom: "Pastels", prix: 1500, quantite: 1 },
        { id: 5, nom: "Thiakry", prix: 200, quantite: 1 }
      ],
      archived: true
    }
  ]);
  
  // État pour le modal de détails/modification
  const [showModal, setShowModal] = useState(false);
  const [currentCommande, setCurrentCommande] = useState(null);
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [showArchived, setShowArchived] = useState(false);
  
  // Fonction pour filtrer les commandes
  const filteredCommandes = commandes.filter(commande => {
    const matchesSearch = 
      commande.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      commande.id.toString().includes(searchTerm);
    const matchesStatut = filterStatut === "Tous" || commande.statut === filterStatut;
    const matchesArchived = showArchived ? true : !commande.archived;
    
    return matchesSearch && matchesStatut && matchesArchived;
  });
  
  // Fonction pour mettre à jour le statut d'une commande
  const updateCommandeStatus = (id, newStatus) => {
    setCommandes(commandes.map(commande => 
      commande.id === id ? {...commande, statut: newStatus} : commande
    ));
  };
  
  // Fonction pour archiver/désarchiver une commande
  const toggleArchiveCommande = (id) => {
    setCommandes(commandes.map(commande => 
      commande.id === id ? {...commande, archived: !commande.archived} : commande
    ));
  };
  
  // Fonction pour ouvrir le modal de détails
  const openCommandeDetails = (commande) => {
    setCurrentCommande({...commande});
    setShowModal(true);
  };
  
  // Fonction pour sauvegarder les modifications
  const saveCommandeChanges = () => {
    setCommandes(commandes.map(commande => 
      commande.id === currentCommande.id ? currentCommande : commande
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
  
  // Options de statut pour les commandes
  const statutOptions = ["En attente", "En préparation", "En livraison", "Livrée", "Annulée"];

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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commandes</h1>
        
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
                  Afficher les commandes archivées
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommandes.map((commande) => (
                <tr key={commande.id} className={`hover:bg-gray-50 ${commande.archived ? 'bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{commande.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{commande.client}</div>
                    <div className="text-sm text-gray-500">{commande.telephone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(commande.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{commande.montantTotal} FCFA</div>
                    <div className="text-sm text-gray-500">{commande.paiement}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${commande.statut === 'Livrée' ? 'bg-green-100 text-green-800' : 
                        commande.statut === 'Annulée' ? 'bg-red-100 text-red-800' : 
                        commande.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                        commande.statut === 'En préparation' ? 'bg-blue-100 text-blue-800' : 
                        'bg-purple-100 text-purple-800'}`}
                    >
                      {commande.statut}
                    </span>
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
                      <button 
                        onClick={() => toggleArchiveCommande(commande.id)}
                        className={`${commande.archived ? 'text-green-600 hover:text-green-900' : 'text-amber-600 hover:text-amber-900'} tooltip`}
                        title={commande.archived ? 'Désarchiver' : 'Archiver'}
                      >
                        <Archive size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCommandes.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal de détails/modification */}
      {showModal && currentCommande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Commande #{currentCommande.id}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations client</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Nom:</span> {currentCommande.client}</p>
                  <p><span className="font-medium">Téléphone:</span> {currentCommande.telephone}</p>
                  <p><span className="font-medium">Adresse:</span> {currentCommande.adresse}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Informations commande</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Date:</span> {formatDate(currentCommande.date)}</p>
                  <p><span className="font-medium">Méthode de paiement:</span> {currentCommande.paiement}</p>
                  <p><span className="font-medium">Montant total:</span> {currentCommande.montantTotal} FCFA</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Articles commandés</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Plat</th>
                      <th className="text-right py-2">Prix unitaire</th>
                      <th className="text-right py-2">Quantité</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCommande.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{item.nom}</td>
                        <td className="text-right py-2">{item.prix} FCFA</td>
                        <td className="text-right py-2">{item.quantite}</td>
                        <td className="text-right py-2">{item.prix * item.quantite} FCFA</td>
                      </tr>
                    ))}
                    <tr className="border-t font-bold">
                      <td colSpan="3" className="py-2 text-right">Total:</td>
                      <td className="py-2 text-right">{currentCommande.montantTotal} FCFA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Statut de la commande</h3>
              <select
                value={currentCommande.statut}
                onChange={(e) => setCurrentCommande({...currentCommande, statut: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {statutOptions.map((statut, index) => (
                  <option key={index} value={statut}>{statut}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => toggleArchiveCommande(currentCommande.id)}
                className={`px-4 py-2 rounded-md ${
                  currentCommande.archived 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {currentCommande.archived ? 'Désarchiver' : 'Archiver'}
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
  );
};

export default AdminCommandes;
