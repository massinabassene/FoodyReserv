import { useState, useEffect } from 'react';
import { ShoppingCart} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function Commander() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [plats, setPlats] = useState([
    {
      id: 1,
      nom: "Thieboudienne",
      categorie: "Plats principaux",
      description: "Le plat national sénégalais à base de riz, poisson et légumes, cuit dans une sauce tomate épicée.",
      prix: 3500,
      image: "/images/thieboudienne.jpg",
      ingredients: ["Riz", "Poisson", "Tomates", "Carottes", "Aubergines", "Chou", "Épices"],
      tempsPreparation: "45 min",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      nom: "Yassa Poulet",
      categorie: "Plats principaux",
      description: "Poulet mariné grillé servi avec une sauce aux oignons caramélisés et citron, accompagné de riz blanc.",
      prix: 3200,
      image: "/images/yassa.jpg",
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
      image: "/images/pastels.jpg",
      ingredients: ["Pâte à beignet", "Viande hachée ou poisson", "Oignons", "Persil", "Épices"],
      tempsPreparation: "30 min",
      rating: 4.5,
      reviews: 76
    },
    {
      id: 4,
      nom: "Mafé",
      categorie: "Plats principaux",
      description: "Ragoût à base de viande dans une sauce crémeuse à l'arachide, servi avec du riz.",
      prix: 3000,
      image: "/images/mafe.jpg",
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
      image: "/images/salade.jpg",
      ingredients: ["Laitue", "Tomates", "Concombres", "Fataya", "Vinaigrette"],
      tempsPreparation: "15 min",
      rating: 4.3,
      reviews: 45
    },
    {
      id: 6,
      nom: "Thiakry",
      categorie: "Desserts",
      description: "Dessert à base de couscous de mil sucré, mélangé avec du yaourt et parfumé à la fleur d'oranger.",
      prix: 1200,
      image: "/images/thiakry.jpg",
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
      image: "/images/bissap.jpg",
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
      image: "/images/dibi.jpg",
      ingredients: ["Viande de mouton", "Oignons", "Poivrons", "Épices", "Sauce piquante"],
      tempsPreparation: "35 min",
      rating: 4.7,
      reviews: 91
    }
  ]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    telephone: '',
    email: '',
    instructions: '',
    paiement: 'especes',
    quantite: 1
  });
  
  // Initialiser les données utilisateur si disponibles
  useEffect(() => {
    // Définir l'utilisateur comme authentifié par défaut pour permettre l'accès sans authentification
    setIsAuthenticated(true);
    
    // Récupérer les infos utilisateur si disponibles
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        setFormData(prev => ({
          ...prev,
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          telephone: user.telephone || ''
        }));
      }
    }
    
    // Récupérer le plat sélectionné du localStorage
    const platFromStorage = localStorage.getItem('selectedPlat');
    if (platFromStorage) {
      setSelectedPlat(JSON.parse(platFromStorage));
    }
  }, [navigate]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la quantité
  const handleQuantityChange = (increment) => {
    setFormData(prev => ({
      ...prev,
      quantite: Math.max(1, prev.quantite + increment)
    }));
  };

  // Calculer le prix total
  const calculateTotal = () => {
    if (!selectedPlat) return 0;
    return selectedPlat.prix * formData.quantite;
  };

  // Soumettre la commande
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Simuler l'envoi de la commande
    const commande = {
      plat: selectedPlat,
      quantite: formData.quantite,
      total: calculateTotal(),
      client: {
        nom: formData.nom,
        prenom: formData.prenom,
        adresse: formData.adresse,
        telephone: formData.telephone,
        email: formData.email
      },
      instructions: formData.instructions,
      methodePaiement: formData.paiement,
      date: new Date().toISOString()
    };
    
    console.log('Commande soumise:', commande);
    
    // Afficher une confirmation et rediriger vers la page d'accueil
    alert('Votre commande a été enregistrée avec succès! Vous recevrez une confirmation par email.');
    localStorage.removeItem('selectedPlat'); // Nettoyer le localStorage
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-green-700 text-2xl font-bold">FOODY</span>
              <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
              <img src="/images/logo.png" className="h-10 ml-2" alt="Logo" />
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="font-medium">Accueil</a>
            <a href="/menu" className="font-medium">Menu</a>
            <a href="/reserver" className="font-medium">Réserver</a>
            <a href="/apropos" className="font-medium">À propos</a>
            <a href="/contact" className="font-medium">Contactez-Nous</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium"
            >
              {isAuthenticated ? 'MON COMPTE' : 'SE CONNECTER'}
            </button>
          </div>
        </div>
      </header>

      {/* Bannière */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Commander un plat</h1>
          <p className="text-gray-600">Remplissez le formulaire ci-dessous pour finaliser votre commande</p>
        </div>
      </div>

      {/* Formulaire de commande */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!selectedPlat ? (
          <div className="max-w-2xl mx-auto py-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Sélectionner un plat</h2>
            <p className="text-gray-600 mb-6 text-center">Choisissez un plat dans le menu déroulant ci-dessous ou consultez notre menu complet.</p>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <label htmlFor="platSelect" className="block text-gray-700 font-medium mb-2">Plats disponibles</label>
              <div className="relative">
                <select
                  id="platSelect"
                  className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white pr-10"
                  onChange={(e) => {
                    const platId = parseInt(e.target.value);
                    if (platId) {
                      const plat = plats.find(p => p.id === platId);
                      setSelectedPlat(plat);
                      localStorage.setItem('selectedPlat', JSON.stringify(plat));
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Sélectionnez un plat</option>
                  {plats.map(plat => (
                    <option key={plat.id} value={plat.id}>
                      {plat.nom} - {plat.categorie} - {plat.prix.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/menu')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Voir le menu complet
              </button>
              
              <button
                onClick={() => {
                  // Sélectionner un plat aléatoire
                  const randomPlat = plats[Math.floor(Math.random() * plats.length)];
                  setSelectedPlat(randomPlat);
                  localStorage.setItem('selectedPlat', JSON.stringify(randomPlat));
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Plat aléatoire
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-2">Détails de votre commande</h2>
                <div className="flex flex-col md:flex-row items-start gap-6 mt-4">
                  <div className="w-full md:w-1/3">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={selectedPlat.image} 
                        alt={selectedPlat.nom} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/200"; 
                          e.target.alt = "Image non disponible";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-bold mb-2">{selectedPlat.nom}</h3>
                    <p className="text-gray-600 mb-4">{selectedPlat.description}</p>
                    
                    <div className="flex items-center mb-4">
                      <span className="text-gray-700 mr-4">Quantité:</span>
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                        disabled={formData.quantite <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4 font-medium">{formData.quantite}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-gray-700">Prix unitaire:</span>
                      <span className="font-medium">{selectedPlat.prix.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-gray-700">Total:</span>
                      <span className="text-xl font-bold text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-6">Informations de livraison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Adresse de livraison</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Instructions spéciales (optionnel)</label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Instructions pour la livraison ou la préparation..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold mb-6">Mode de paiement</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded-md cursor-pointer">
                    <input
                      type="radio"
                      name="paiement"
                      value="especes"
                      checked={formData.paiement === 'especes'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <h3 className="font-medium">Espèces à la livraison</h3>
                      <p className="text-sm text-gray-600">Payez directement au livreur lors de la réception</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-md cursor-pointer">
                    <input
                      type="radio"
                      name="paiement"
                      value="carte"
                      checked={formData.paiement === 'carte'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <h3 className="font-medium">Carte bancaire</h3>
                      <p className="text-sm text-gray-600">Paiement sécurisé par carte bancaire</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-md cursor-pointer">
                    <input
                      type="radio"
                      name="paiement"
                      value="mobile"
                      checked={formData.paiement === 'mobile'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <h3 className="font-medium">Mobile Money</h3>
                      <p className="text-sm text-gray-600">Paiement via Orange Money, Wave ou autres services</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Total à payer</h3>
                    <p className="text-sm text-gray-600">Livraison incluse</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{calculateTotal().toLocaleString()} FCFA</span>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Confirmer la commande
                </button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  En confirmant votre commande, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
      
      {/* Footer amélioré */}
      <footer className="bg-gray-100 py-12 mt-auto">
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
          
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Commentaires récents</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-2">A</div>
                    <div>
                      <p className="font-medium">Amadou D.</p>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"Le Thieboudienne était délicieux et authentique. Service rapide et personnel très aimable."</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-2">F</div>
                    <div>
                      <p className="font-medium">Fatou S.</p>
                      <div className="flex text-yellow-500">
                        {[...Array(4)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">"J'ai adoré le Yassa Poulet, très savoureux. La livraison était un peu lente mais ça valait l'attente."</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">© 2025 FoodyReserv. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    );
}