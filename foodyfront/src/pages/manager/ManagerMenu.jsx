import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Plus, Edit, Trash, X, Check, Search , Users} from 'lucide-react';
import { getActiveMenus, createMenu, updateMenu, deleteMenu } from '../../api/api';

const ManagerMenu = () => {
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page d'accueil au lieu de la page de connexion
    navigate('/');
  };
  const navigate = useNavigate();
  const categories = ["Plats principaux", "Entrées", "Desserts", "Boissons", "Spécialités"];
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({
    id: null,
    nom: "",
    categorie: "Plats principaux",
    description: "",
    prix: 0,
    image: "",
    estActif: true
  });
  

  // Ajoutez cette fonction après vos déclarations de state
const resetForm = () => {
  setShowForm(false);
  setEditMode(false);
  setSelectedImages([]);
  setCurrentMenu({
    id: null,
    nom: "",
    categorie: "Plats principaux",
    description: "",
    prix: 0,
    image: "",
    estActif: true
  });
};
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [selectedImages, setSelectedImages] = useState([]);

  // Get user role
  const role = JSON.parse(localStorage.getItem('user'))?.role;

  console.log(role);
  // Fetch active menus
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await getActiveMenus();
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);
  
  // Filter menus
  const filteredMenus = Array.isArray(menus) ? menus.filter(menu => {
    const matchesSearch = 
      menu.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      menu.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Tous" || menu.categorie === filterCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  // Add or update menu
  // Dans ManagerMenu.jsx, remplacez la fonction handleAddMenu par celle-ci :

const handleAddMenu = async () => {
  try {
    if (editMode) {
      // Mode édition
      const updatedMenu = await updateMenu(currentMenu.id, { ...currentMenu }, role);
      setMenus(menus.map(menu => 
        menu.id === currentMenu.id ? updatedMenu.data || currentMenu : menu
      ));
      console.log('Menu mis à jour avec succès');
    } else {
      // Mode création
      // Validation des données obligatoires
      if (!currentMenu.nom || !currentMenu.prix) {
        throw new Error('Le nom et le prix sont obligatoires');
      }
      
      // Préparer les données du menu sans l'image
      const menuData = {
        nom: currentMenu.nom,
        description: currentMenu.description,
        prix: currentMenu.prix,
        categorie: currentMenu.categorie,
        estActif: currentMenu.estActif
      };
      
      // Créer le menu avec les images sélectionnées
      const newMenu = await createMenu(menuData, selectedImages, role);
      setMenus([...menus, newMenu.data || newMenu]);
      console.log('Menu créé avec succès');
    }
    
    // Réinitialiser le formulaire
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du menu:', error);
    
    // Afficher un message d'erreur spécifique à l'utilisateur
    if (error.message === 'Accès non autorisé') {
      alert('Vous n\'avez pas les permissions pour effectuer cette action');
    } else if (error.message === 'Le nom et le prix sont obligatoires') {
      alert('Veuillez remplir tous les champs obligatoires');
    } else {
      alert('Une erreur est survenue lors de la sauvegarde du menu');
    }
  }
};

  // Edit menu
  const handleEditMenu = (menu) => {
    setCurrentMenu(menu);
    setEditMode(true);
    setShowForm(true);
  };

  // Delete menu
  const handleDeleteMenu = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) {
      try {
        await deleteMenu(id, role);
        setMenus(menus.filter(menu => menu.id !== id));
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  // Toggle availability
  const toggleDisponibilite = async (id) => {
    const menu = menus.find(m => m.id === id);
    try {
      await updateMenu(id, { ...menu, estActif: !menu.estActif }, role);
      setMenus(menus.map(menu => 
        menu.id === id ? { ...menu, estActif: !menu.estActif } : menu
      ));
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentMenu({
      ...currentMenu,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // For preview, use the first file
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMenu({ ...currentMenu, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
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
              <p className="text-center text-gray-600 mt-2">Administration</p>
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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
          <h1 className="text-3xl font-bold text-gray-800">Gestion du Menu</h1>
          <button
            onClick={() => {
              setEditMode(false);
              setSelectedImages([]);
              setCurrentMenu({
                id: null,
                nom: "",
                categorie: "Plats principaux",
                description: "",
                prix: 0,
                image: "",
                estActif: true
              });
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un menu
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher un menu..."
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

        {/* Menus List */}
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
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
                {filteredMenus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={menu.images[0]?.imageUrl ? `https://foodyreserv-backend.up.railway.app${menu.images[0].imageUrl}` : "https://via.placeholder.com/150?text=Image+non+disponible"}
                          alt={menu.nom}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=Image+non+disponible";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{menu.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{menu.categorie}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{menu.prix} FCFA</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleDisponibilite(menu.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          menu.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {menu.estActif ? 'Disponible' : 'Indisponible'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMenu(menu)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMenus.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucun menu trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Menu Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editMode ? 'Modifier le menu' : 'Ajouter un nouveau menu'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du menu</label>
                    <input
                      type="text"
                      name="nom"
                      value={currentMenu.nom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      name="categorie"
                      value={currentMenu.categorie}
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
                      value={currentMenu.prix}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image(s) du menu</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="menuImage"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('menuImage').click()}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm transition-all duration-300"
                      >
                        Choisir des images
                      </button>
                      {selectedImages.length > 0 && (
                        <span className="text-green-600 text-sm">
                          {selectedImages.length} image(s) sélectionnée(s)
                        </span>
                      )}
                    </div>
                    {currentMenu.image && (
                      <div className="mt-2 h-32 w-32 rounded-md overflow-hidden bg-gray-100">
                        <img src={currentMenu.image} alt="Aperçu" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="estActif"
                      checked={currentMenu.estActif}
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
                    value={currentMenu.description}
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
                  onClick={handleAddMenu}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
                  disabled={!currentMenu.nom || !currentMenu.description || !currentMenu.prix}
                >
                  <Check size={20} className="mr-2" />
                  {editMode ? 'Enregistrer les modifications' : 'Ajouter le menu'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerMenu;