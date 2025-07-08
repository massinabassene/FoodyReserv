import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, Filter, Clock, ChevronRight } from 'lucide-react';
import MenuSlider from '../components/MenuSlider';
import Header from '../components/Header'; // Import du composant Header
import { getUserRole } from '../utils/auth'; // Ajoute cet import

// Import des images
import thieboudieune from '../images/thieboudieune.jpg';
import yassapoulet from '../images/yassapoulet.jpg';
import mafe from '../images/mafé.jpg';
import thiakry from '../images/thiakry.jpg';
import salade from '../images/salade.png';
import bissap from '../images/jusdebissap.png';
import dibi from '../images/dibi.png';
import pastels from '../images/pastel.png';

export default function Menu() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [showPlatDetails, setShowPlatDetails] = useState(false);
  
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // Catégories de plats
  const categories = ['Tous', 'Entrées', 'Plats principaux', 'Desserts', 'Boissons', 'Spécialités'];
  
  // Données des plats (simulées)
  const plats = [
    {
      id: 1,
      nom: "Thieboudienne",
      categorie: "Plats principaux",
      description: "Le plat national sénégalais à base de riz, poisson et légumes, cuit dans une sauce tomate épicée. Un délice authentique qui représente la richesse de la cuisine sénégalaise.",
      prix: 3500,
      image: thieboudieune,
      ingredients: ["Riz", "Poisson", "Tomates", "Carottes", "Aubergines", "Chou", "Épices"],
      tempsPreparation: "45 min",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      nom: "Yassa Poulet",
      categorie: "Plats principaux",
      description: "Poulet mariné grillé servi avec une sauce aux oignons caramélisés et citron, accompagné de riz blanc. Un plat savoureux aux saveurs acidulées et douces à la fois.",
      prix: 3200,
      image: yassapoulet,
      ingredients: ["Poulet", "Oignons", "Citron", "Moutarde", "Riz", "Épices"],
      tempsPreparation: "40 min",
      rating: 4.6,
      reviews: 98
    },
    {
      id: 3,
      nom: "Pastels",
      categorie: "Entrées",
      description: "Beignets farcis à la viande ou au poisson, épicés et frits, servis avec une sauce piquante.",
      prix: 1500,
      image: pastels,
      ingredients: ["Pâte à beignet", "Viande hachée ou poisson", "Oignons", "Persil", "Épices"],
      tempsPreparation: "30 min",
      rating: 4.5,
      reviews: 76
    },
    {
      id: 4,
      nom: "Mafé",
      categorie: "Plats principaux",
      description: "Ragoût à base de viande dans une sauce crémeuse à l'arachide, servi avec du riz. Un plat riche et onctueux qui fait la fierté de la cuisine ouest-africaine.",
      prix: 3000,
      image: mafe,
      ingredients: ["Viande de bœuf", "Pâte d'arachide", "Tomates", "Carottes", "Pommes de terre", "Riz"],
      tempsPreparation: "50 min",
      rating: 4.7,
      reviews: 87
    },
    {
      id: 5,
      nom: "Salade Fataya",
      categorie: "Entrées",
      description: "Salade fraîche de légumes avec des morceaux de fataya (chaussons de viande épicée).",
      prix: 1800,
      image: salade,
      ingredients: ["Laitue", "Tomates", "Concombres", "Fataya", "Vinaigrette"],
      tempsPreparation: "15 min",
      rating: 4.3,
      reviews: 45
    },
    {
      id: 6,
      nom: "Thiakry",
      categorie: "Desserts",
      description: "Dessert à base de couscous de mil sucré, mélangé avec du yaourt et parfumé à la fleur d'oranger. Une douceur rafraîchissante pour terminer votre repas en beauté.",
      prix: 1200,
      image: thiakry,
      ingredients: ["Couscous de mil", "Yaourt", "Lait concentré sucré", "Fleur d'oranger", "Raisins secs"],
      tempsPreparation: "20 min",
      rating: 4.4,
      reviews: 62
    },
    {
      id: 7,
      nom: "Jus de Bissap",
      categorie: "Boissons",
      description: "Boisson rafraîchissante à base de fleurs d'hibiscus, sucrée et parfumée à la menthe et vanille.",
      prix: 800,
      image: bissap,
      ingredients: ["Fleurs d'hibiscus", "Sucre", "Menthe", "Vanille"],
      tempsPreparation: "10 min",
      rating: 4.9,
      reviews: 103
    },
    {
      id: 8,
      nom: "Dibi",
      categorie: "Spécialités",
      description: "Viande de mouton grillée, assaisonnée d'épices et servie avec des oignons et une sauce piquante.",
      prix: 4000,
      image: dibi,
      ingredients: ["Viande de mouton", "Oignons", "Poivrons", "Épices", "Sauce piquante"],
      tempsPreparation: "35 min",
      rating: 4.7,
      reviews: 91
    }
  ];

    const headerRef = useRef(null);
    const [animationComplete, setAnimationComplete] = useState(false);
    
  
    // Vérifier l'authentification
    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setUserRole(getUserRole());
  
      // Animation d'entrée pour le header
      setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.classList.add('animate-header');
        }
      }, 100);
  
      setTimeout(() => {
        setAnimationComplete(true);
      }, 1500);
    }, []);

  // Filtrer les plats en fonction de la recherche et de la catégorie
  const filteredPlats = plats.filter(plat => {
    const matchesSearch = plat.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         plat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || plat.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ouvrir les détails d'un plat
  const openPlatDetails = (plat) => {
    setSelectedPlat(plat);
    setShowPlatDetails(true);
    window.scrollTo(0, 0);
  };

  // Fermer les détails d'un plat
  const closePlatDetails = () => {
    setShowPlatDetails(false);
    setSelectedPlat(null);
  };

  // Commander un plat
  const commanderPlat = (plat) => {
    // Stocker le plat sélectionné dans le localStorage pour le formulaire de commande
    localStorage.setItem('selectedPlat', JSON.stringify(plat));
    navigate('/commander');
  };

  // Soumettre une évaluation
  const submitRating = (e) => {
    e.preventDefault();
    
    alert(`Merci pour votre évaluation de ${userRating} étoiles et votre commentaire!`);
    setUserRating(0);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header userRole={userRole} isAuthenticated={isAuthenticated} />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20">
        {showPlatDetails && selectedPlat ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between mb-4">
              <h1 className="text-3xl font-bold">{selectedPlat.nom}</h1>
              <button 
                onClick={closePlatDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                Retour au menu
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={selectedPlat.image} 
                  alt={selectedPlat.nom} 
                  className="w-full h-80 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300"; 
                    e.target.alt = "Image non disponible";
                  }}
                />
                
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < Math.floor(selectedPlat.rating) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-700">{selectedPlat.rating} ({selectedPlat.reviews} avis)</span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Votre avis compte</h3>
                  <form onSubmit={submitRating} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Votre note</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              size={24} 
                              className="text-yellow-500" 
                              fill={star <= userRating ? "currentColor" : "none"} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Votre commentaire</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="Partagez votre expérience avec ce plat..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Soumettre
                    </button>
                  </form>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700">{selectedPlat.description}</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Ingrédients</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPlat.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6 flex items-center">
                  <Clock size={20} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Temps de préparation: {selectedPlat.tempsPreparation}</span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Prix</h2>
                  <p className="text-2xl font-bold text-green-600">{selectedPlat.prix.toLocaleString()} FCFA</p>
                </div>
                
                <button
                  onClick={() => commanderPlat(selectedPlat)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Commander ce plat
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Slider avant le menu */}
            <MenuSlider />
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Menu à la carte</h1>
              <p className="text-gray-600">Découvrez nos délicieuses spécialités sénégalaises</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-2/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un plat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                  />
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md appearance-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlats.map((plat) => (
                <div 
                  key={plat.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={plat.image} 
                      alt={plat.nom} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/200"; 
                        e.target.alt = "Image non disponible";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-medium flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                      <span>{plat.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold">{plat.nom}</h2>
                      <span className="font-bold text-green-600">{plat.prix.toLocaleString()} FCFA</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plat.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openPlatDetails(plat)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        Voir détails
                        <ChevronRight size={16} />
                      </button>
                      
                      <button
                        onClick={() => commanderPlat(plat)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">À propos de FoodyReserv</h3>
              <p className="text-gray-600 mb-4">
                Restaurant de spécialités sénégalaises offrant une expérience culinaire authentique. 
                Nous proposons des plats traditionnels préparés avec des ingrédients frais et locaux.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contactez-nous</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Votre message"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Informations</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Adresse:</span>
                  <span>123 Rue de la Gastronomie, Dakar, Sénégal</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Téléphone:</span>
                  <span>+221 77 123 45 67</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Email:</span>
                  <span>contact@foodyreserv.com</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Horaires:</span>
                  <div>
                    <p>Lundi - Jeudi: 11h00 - 22h00</p>
                    <p>Vendredi - Dimanche: 11h00 - 23h00</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">© 2025 FoodyReserv. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}