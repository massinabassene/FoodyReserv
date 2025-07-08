import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Plus, Edit, Trash, X, Check, Search } from 'lucide-react';

const AdminMenu = () => {
  const navigate = useNavigate();
  
  // Données statiques pour les catégories
  const categories = [
    "Plats principaux",
    "Entrées",
    "Desserts",
    "Boissons",
    "Spécialités"
  ];
  
  // Chargement des plats depuis localStorage ou utilisation des données statiques par défaut
  const [plats, setPlats] = useState(() => {
    const savedPlats = localStorage.getItem('foodyreserv-plats');
    return savedPlats ? JSON.parse(savedPlats) : [
      {
        id: 1,
        nom: "Thieboudienne",
        categorie: "Plats principaux",
        description: "Le plat national sénégalais à base de riz, poisson et légumes, cuit dans une sauce tomate épicée.",
        prix: 3500,
        image: "../images/thieboudienne.jpg",
        disponible: true,
        isNew: false
      },
      {
        id: 2,
        nom: "Yassa Poulet",
        categorie: "Plats principaux",
        description: "Poulet mariné grillé servi avec une sauce aux oignons caramélisés et citron, accompagné de riz blanc.",
        prix: 3200,
        image: "../images/yassapoulet.jpg",
        disponible: true,
        isNew: false
      },
      {
        id: 3,
        nom: "Mafé",
        categorie: "Plats principaux",
        description: "Ragoût à base de viande dans une sauce crémeuse à l'arachide, servi avec du riz.",
        prix: 3000,
        image: "../images/mafe.jpg",
        disponible: true,
        isNew: false
      },
      {
        id: 4,
        nom: "Pastels",
        categorie: "Entrées",
        description: "Petits chaussons frits farcis à la viande ou au poisson, épicés et servis avec une sauce piquante.",
        prix: 1500,
        image: "../images/pastel.png",
        disponible: true,
        isNew: false
      },
      {
        id: 5,
        nom: "Thiakry",
        categorie: "Desserts",
        description: "Dessert à base de couscous sucré mélangé avec du yaourt et parfumé à la fleur d'oranger.",
        prix: 1200,
        image: "../images/thiakry.jpg",
        disponible: true,
        isNew: false
      }
    ];
  });
  
  // Sauvegarder les plats dans localStorage chaque fois qu'ils changent
  useEffect(() => {
    localStorage.setItem('foodyreserv-plats', JSON.stringify(plats));
  }, [plats]);

  // État pour le formulaire d'ajout/modification de plat
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPlat, setCurrentPlat] = useState({
    id: null,
    nom: "",
    categorie: "Plats principaux",
    description: "",
    prix: 0,
    image: "",
    disponible: true
  });
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  
  // Fonction pour filtrer les plats
  const filteredPlats = plats.filter(plat => {
    const matchesSearch = plat.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Tous" || plat.categorie === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Fonction pour ajouter un nouveau plat
  const handleAddPlat = () => {
    if (editMode) {
      // Modification d'un plat existant
      setPlats(plats.map(plat => 
        plat.id === currentPlat.id ? currentPlat : plat
      ));
    } else {
      // Ajout d'un nouveau plat
      const newPlat = {
        ...currentPlat,
        id: plats.length > 0 ? Math.max(...plats.map(p => p.id)) + 1 : 1,
        isNew: true, // Marquer comme nouveau plat
        dateAdded: new Date().toISOString() // Ajouter la date d'ajout
      };
      
      // Réinitialiser le statut isNew pour tous les autres plats
      const updatedPlats = plats.map(plat => ({
        ...plat,
        isNew: false
      }));
      
      // Ajouter le nouveau plat à la liste mise à jour
      setPlats([...updatedPlats, newPlat]);
      
      // Stocker le dernier plat ajouté dans localStorage pour l'affichage des confettis
      localStorage.setItem('foodyreserv-last-plat', JSON.stringify(newPlat));
    }
    
    // Réinitialiser le formulaire
    setShowForm(false);
    setEditMode(false);
    setCurrentPlat({
      id: null,
      nom: "",
      categorie: "Plats principaux",
      description: "",
      prix: 0,
      image: "",
      disponible: true
    });
  };
  
  // Fonction pour modifier un plat
  const handleEditPlat = (plat) => {
    setCurrentPlat(plat);
    setEditMode(true);
    setShowForm(true);
  };
  
  // Fonction pour supprimer un plat
  const handleDeletePlat = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) {
      setPlats(plats.filter(plat => plat.id !== id));
    }
  };
  
  // Fonction pour changer la disponibilité d'un plat
  const toggleDisponibilite = (id) => {
    setPlats(plats.map(plat => 
      plat.id === id ? {...plat, disponible: !plat.disponible} : plat
    ));
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPlat({
      ...currentPlat,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
          <div className="flex items-center justify-center">
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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion du Menu</h1>
          <button 
            onClick={() => {
              setEditMode(false);
              setCurrentPlat({
                id: null,
                nom: "",
                categorie: "Plats principaux",
                description: "",
                prix: 0,
                image: "",
                disponible: true
              });
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un plat
          </button>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher un plat..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex items-center">
              <label className="mr-2 text-gray-700">Catégorie:</label>
              <select
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="Tous">Tous</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Liste des plats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlats.map((plat) => (
                <tr key={plat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={plat.image} 
                        alt={plat.nom} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Image+non+disponible";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plat.nom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{plat.categorie}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{plat.prix} FCFA</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleDisponibilite(plat.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plat.disponible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plat.disponible ? 'Disponible' : 'Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPlat(plat)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeletePlat(plat.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal pour ajouter/modifier un plat */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editMode ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du plat</label>
                  <input
                    type="text"
                    name="nom"
                    value={currentPlat.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    name="categorie"
                    value={currentPlat.categorie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    name="prix"
                    value={currentPlat.prix}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image du plat</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="platImage"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCurrentPlat({
                              ...currentPlat,
                              image: reader.result
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('platImage').click()}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm transition-all duration-300"
                    >
                      Choisir une image
                    </button>
                    {currentPlat.image && (
                      <span className="text-green-600 text-sm">Image sélectionnée</span>
                    )}
                  </div>
                  {currentPlat.image && (
                    <div className="mt-2 h-32 w-32 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={currentPlat.image} 
                        alt="Aperçu" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={currentPlat.disponible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Disponible</label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentPlat.description}
                  onChange={handleInputChange}
                  rows="10"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Annuler
              </button>
              <button
                onClick={handleAddPlat}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Check size={20} className="mr-2" />
                {editMode ? 'Enregistrer les modifications' : 'Ajouter le plat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
