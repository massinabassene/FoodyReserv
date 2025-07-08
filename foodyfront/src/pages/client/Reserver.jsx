import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Gift } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Reserver() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    nombrePersonnes: '2',
    occasion: '',
    commentaires: '',
    menuSelectionne: ''
  });
  const [menus, setMenus] = useState([
    { id: 1, nom: "Menu Découverte", description: "Entrée + Plat + Dessert", prix: 23000 },
    { id: 2, nom: "Menu Gourmet", description: "Amuse-bouche + Entrée + Plat + Fromage + Dessert", prix: 36000 },
    { id: 3, nom: "Menu Végétarien", description: "Entrée végétarienne + Plat végétarien + Dessert", prix: 19500 },
    { id: 4, nom: "Menu Enfant", description: "Plat simplifié + Dessert + Boisson", prix: 9800 }
  ]);

  // Générer les options pour les heures de réservation
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const occasionOptions = [
    "Aucune occasion spéciale",
    "Anniversaire",
    "Dîner romantique",
    "Réunion d'affaires",
    "Fête de famille",
    "Autre"
  ];

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      // Rediriger vers la page de connexion si non authentifié
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ici, vous feriez normalement un appel API pour enregistrer la réservation
    try {
      console.log('Données de réservation:', formData);
      alert('Réservation effectuée avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barre de navigation réutilisable */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Réservation de table</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Détails de la réservation
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Date de réservation</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Heure de réservation</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionnez une heure</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <Users className="mr-2" size={20} />
                    Nombre de personnes
                  </label>
                  <select
                    name="nombrePersonnes"
                    value={formData.nombrePersonnes}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'personne' : 'personnes'}</option>
                    ))}
                    <option value="plus">Plus de 10 personnes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center">
                    <Gift className="mr-2" size={20} />
                    Occasion
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionnez une occasion (optionnel)</option>
                    {occasionOptions.map((occasion, index) => (
                      <option key={index} value={occasion}>{occasion}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Commentaires ou demandes spéciales</label>
                <textarea
                  name="commentaires"
                  value={formData.commentaires}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Allergies, préférences alimentaires, placement..."
                ></textarea>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Sélection de menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menus.map(menu => (
                    <div 
                      key={menu.id} 
                      className={`border p-4 rounded-md cursor-pointer transition-all ${formData.menuSelectionne === menu.id.toString() ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
                      onClick={() => setFormData({...formData, menuSelectionne: menu.id.toString()})}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{menu.nom}</h4>
                          <p className="text-sm text-gray-600">{menu.description}</p>
                        </div>
                        <span className="font-bold">{menu.prix.toLocaleString()} FCFA</span>
                      </div>
                      {formData.menuSelectionne === menu.id.toString() && (
                        <div className="mt-2 text-green-600 text-sm">✓ Sélectionné</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
                >
                  Confirmer la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">© 2025 FoodyReserv. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
