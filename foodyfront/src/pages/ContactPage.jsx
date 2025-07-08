import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import { getUserRole } from '../utils/auth'; // Ajoute cet import


export default function ContactPage() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header fixé */}
      <Header userRole={userRole} isAuthenticated={isAuthenticated} />

      {/* Espace sous le header */}
      <div className="pt-20 container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Contactez-Nous</h1>

          <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

                {formSubmitted && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                    <p>Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full border rounded-md p-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border rounded-md p-3"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full border rounded-md p-3"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className="w-full border rounded-md p-3"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-600 transition-colors w-full md:w-auto"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>

                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="flex mb-6">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <MapPin className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Notre adresse</h3>
                      <p className="text-gray-600">123 Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
                    </div>
                  </div>

                  <div className="flex mb-6">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <Mail className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-gray-600">contact@foodyreserv.com</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <Phone className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Téléphone</h3>
                      <p className="text-gray-600">+221 33 123 45 67</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center">
                    <MessageSquare className="mr-2 text-yellow-500" />
                    Horaires du service client
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Lundi - Vendredi:</span>
                      <span className="font-medium">8h - 20h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Samedi:</span>
                      <span className="font-medium">9h - 18h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dimanche:</span>
                      <span className="font-medium">10h - 16h</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Notre localisation</h3>
              <div className="w-24 h-1 bg-green-600 mb-6" />
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-yellow-400 opacity-20" />
                <div className="text-center z-10">
                  <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium">123 Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
                  <p className="text-gray-600">Dakar, Sénégal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer commun */}
      <footer className="bg-yellow-600 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">FOODY RESERV</h3>
              <p>La meilleure plateforme de livraison de repas à Dakar</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-3">À propos</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="hover:text-yellow-500">Qui sommes-nous</a></li>
                  <li><a href="/how-it-works" className="hover:text-yellow-500">Comment ça marche</a></li>
                  <li><a href="/blog" className="hover:text-yellow-500">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Aide</h4>
                <ul className="space-y-2">
                  <li><a href="/faq" className="hover:text-yellow-500">FAQ</a></li>
                  <li><a href="/contact" className="hover:text-yellow-500">Contact</a></li>
                  <li><a href="/terms" className="hover:text-yellow-500">Conditions</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Partenaires</h4>
                <ul className="space-y-2">
                  <li><a href="/restaurants" className="hover:text-yellow-500">Restaurants</a></li>
                  <li><a href="/drivers" className="hover:text-yellow-500">Livreurs</a></li>
                  <li><a href="/investors" className="hover:text-yellow-500">Investisseurs</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>© 2025 FOODY RESERV. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
