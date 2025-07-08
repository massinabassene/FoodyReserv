import { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { getUserRole } from '../utils/auth'; // Ajoute cet import

export default function Apropos() {
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

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">
      {/* Barre de navigation réutilisable */}
      <Header userRole={userRole} isAuthenticated={isAuthenticated} />

      {/* Espacement supérieur */}
      <div className="container mx-auto px-4 pt-6">
        {/* Suppression du bouton retour */}
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">À propos de FOODY RESERV</h1>

          <div className="mb-10 flex justify-center">
            <img
              src="/images/about-hero.jpg"
              alt="L'équipe FOODY RESERV"
              className="rounded-lg shadow-md max-w-full h-auto"
              onError={(e) => {
                e.target.src = "/api/placeholder/800/400";
                e.target.alt = "Image équipe FOODY RESERV";
              }}
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Notre Mission</h2>
            <p className="mb-6">
              Chez <strong>FOODY RESERV</strong>, notre mission est de connecter les amateurs de bonne cuisine aux meilleurs restaurants de Dakar.
              Nous facilitons la commande et la livraison de repas, permettant à chacun de savourer des plats exceptionnels dans le confort de son domicile ou de son bureau.
            </p>

            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Notre Histoire</h2>
            <p className="mb-6">
              Fondée en 2023 à Dakar, FOODY RESERV est née d'une vision simple : offrir un service de livraison de repas fiable, rapide et de qualité.
              Nous avons commencé avec quelques restaurants partenaires et une équipe passionnée. Aujourd'hui, nous sommes fiers de collaborer avec plus de 100 établissements
              et de servir des milliers de clients satisfaits chaque jour.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2 text-center">+100</h3>
                <p className="text-center">Restaurants partenaires</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2 text-center">+10 000</h3>
                <p className="text-center">Clients satisfaits</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-2 text-center">+50</h3>
                <p className="text-center">Livreurs partenaires</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-red-600 mb-4">Nos Valeurs</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Qualité :</strong> Nous sélectionnons soigneusement nos restaurants partenaires pour vous offrir les meilleurs plats.</li>
              <li><strong>Rapidité :</strong> Notre réseau de livreurs garantit une livraison rapide et fiable.</li>
              <li><strong>Transparence :</strong> Pas de frais cachés, vous savez exactement ce que vous payez.</li>
              <li><strong>Innovation :</strong> Nous améliorons constamment notre plateforme pour une expérience optimale.</li>
              <li><strong>Engagement local :</strong> Nous soutenons l'économie locale en privilégiant les restaurants dakarois.</li>
            </ul>

            <h2 className="text-2xl font-bold text-green-700 mb-4">Notre Équipe</h2>
            <p className="mb-6">
              FOODY RESERV est portée par une équipe dynamique et passionnée. Nos collaborateurs partagent un objectif commun :
              vous offrir la meilleure expérience culinaire possible. Du développement web à la livraison, chaque membre de notre équipe
              contribue à faire de FOODY RESERV le service de livraison préféré des Dakarois.
            </p>
          </div>

          <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-2xl font-bold mb-4">Vous êtes un restaurant ?</h2>
            <p className="mb-4">
              Rejoignez notre réseau de restaurants partenaires et développez votre activité grâce à notre service de livraison.
            </p>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-600 transition-colors">
              Devenir partenaire
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                  <li><a href="/about" className="hover:text-yellow-300">Qui sommes-nous</a></li>
                  <li><a href="/how-it-works" className="hover:text-yellow-300">Comment ça marche</a></li>
                  <li><a href="/blog" className="hover:text-yellow-300">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Aide</h4>
                <ul className="space-y-2">
                  <li><a href="/faq" className="hover:text-yellow-300">FAQ</a></li>
                  <li><a href="/contact" className="hover:text-yellow-300">Contact</a></li>
                  <li><a href="/terms" className="hover:text-yellow-300">Conditions</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Partenaires</h4>
                <ul className="space-y-2">
                  <li><a href="/restaurants" className="hover:text-yellow-300">Restaurants</a></li>
                  <li><a href="/drivers" className="hover:text-yellow-300">Livreurs</a></li>
                  <li><a href="/investors" className="hover:text-yellow-300">Investisseurs</a></li>
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
