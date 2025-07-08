import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, MapPin, ShoppingCart, Star, Clock, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import AnimatedFoodCard from '../components/AnimatedFoodCard';
import CuisineShowcase from '../components/CuisineShowcase';
import ParallaxSection from '../components/ParallaxSection';
import PhotoGallery from '../components/PhotoGallery';
import { getUserRole } from '../utils/auth'; // Ajoute cet import
import Header from '../components/Header';

// Importation des images
import platsSenegalais from '../images/Plats Sénégalais.png';
import livreur from '../images/livreur.png';
import reservation from '../images/reservation.png';
import serveur from '../images/serveur.png';
import tables from '../images/tables.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchAddress, setSearchAddress] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);

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

  // Gérer l'affichage du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Remonter en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation
  const navigateToPage = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  // Recherche d'adresse
  const handleSearch = () => {
    if (searchAddress.trim()) {
      console.log('Recherche de restaurants près de :', searchAddress);
      // Simuler une recherche (à remplacer par une API réelle)
      navigateToPage('/menu');
    }
  };

  // Configuration du carrousel
  const carouselImages = [
    {
      src: platsSenegalais,
      alt: 'Plats Sénégalais',
      caption: 'Découvrez nos spécialités sénégalaises',
      description: 'Des saveurs authentiques préparées avec des ingrédients frais et locaux',
      buttonText: 'Voir le menu',
      buttonAction: () => navigateToPage('/menu'),
    },
    {
      src: reservation,
      alt: 'Réservation de table',
      caption: 'Réservez votre table',
      description: 'Une expérience culinaire unique dans un cadre chaleureux',
      buttonText: 'Réserver maintenant',
      buttonAction: () => navigateToPage('/reserver'),
    },
    {
      src: livreur,
      alt: 'Livraison à domicile',
      caption: 'Livraison rapide à domicile',
      description: 'Profitez de nos délicieux plats dans le confort de votre foyer',
      buttonText: 'Commander',
      buttonAction: () => navigateToPage('/commander'),
    },
    {
      src: serveur,
      alt: 'Service de qualité',
      caption: 'Un service attentionné',
      description: 'Notre équipe est dévouée à vous offrir une expérience inoubliable',
      buttonText: 'En savoir plus',
      buttonAction: () => navigateToPage('/apropos'),
    },
    {
      src: tables,
      alt: 'Ambiance du restaurant',
      caption: 'Une ambiance conviviale',
      description: 'Un cadre idéal pour vos repas en famille ou entre amis',
      buttonText: 'Nous contacter',
      buttonAction: () => navigateToPage('/contact'),
    },
  ];

  // Plats spéciaux
  const specialPlats = [
    {
      id: 1,
      nom: 'Thieboudienne',
      categorie: 'Plats principaux',
      description:
        'Le plat national sénégalais à base de riz, poisson et légumes, cuit dans une sauce tomate épicée.',
      prix: 3500,
      image: '/images/tieboudieun.png',
      rating: 4.8,
    },
    {
      id: 2,
      nom: 'Yassa Poulet',
      categorie: 'Plats principaux',
      description:
        'Poulet mariné grillé servi avec une sauce aux oignons caramélisés et citron, accompagné de riz blanc.',
      prix: 3200,
      image: '/images/yassa.png',
      rating: 4.6,
    },
    {
      id: 3,
      nom: 'Mafé',
      categorie: 'Plats principaux',
      description: 'Ragoût à base de viande dans une sauce crémeuse à l’arachide, servi avec du riz.',
      prix: 3000,
      image: '/images/image.png',
      rating: 4.7,
    },
  ];

  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/menu', label: 'Menu' },
        { path: '/login', label: 'Commander', disabled: true, title: 'Connectez-vous pour commander' },
        { path: '/login', label: 'Réserver', disabled: true, title: 'Connectez-vous pour réserver' },
        { path: '/apropos', label: 'À propos' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    if (userRole === 'CLIENT') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/menu', label: 'Menu' },
        { path: '/commander', label: 'Commander' },
        { path: '/reserver', label: 'Réserver' },
        { path: '/apropos', label: 'À propos' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    if (userRole === 'MANAGER') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/admin/commandes', label: 'Commandes' },
        { path: '/admin/reservations', label: 'Réservations' },
        { path: '/admin/menus', label: 'Gestion Menu' },
        { path: '/admin/clients', label: 'Clients' },
      ];
    }

    if (userRole === 'LIVREUR') {
      return [
        { path: '/', label: 'Accueil' },
        { path: '/livreur/commandes', label: 'Mes Livraisons' },
        { path: '/livreur/disponibilite', label: 'Disponibilité' },
        { path: '/contact', label: 'Contactez-Nous' },
      ];
    }

    // Par défaut
    return [
      { path: '/', label: 'Accueil' },
      { path: '/menu', label: 'Menu' },
      { path: '/apropos', label: 'À propos' },
      { path: '/contact', label: 'Contactez-Nous' },
    ];
  };


  // Navigation dynamique selon le rôle
  const getProfilePath = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'CLIENT') return '/profile';
    if (userRole === 'MANAGER') return '/admin/profile';
    if (userRole === 'LIVREUR') return '/livreur/profile';
    return '/profile';
  };

  const getCommanderPath = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'CLIENT') return '/commander';
    if (userRole === 'MANAGER') return '/admin/commandes';
    if (userRole === 'LIVREUR') return '/livreur/commandes';
    return '/commander';
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* SEO Metadata */}
      <>
        <title>FOODY RESERV - Accueil</title>
        <meta
          name="description"
          content="Découvrez FOODY RESERV, votre plateforme pour commander des plats sénégalais authentiques et réserver une table à Dakar."
        />
      </>

      {/* Header */}
      <Header  userRole={userRole} isAuthenticated={isAuthenticated} />

      {/* Carrousel */}
      <section className="relative">
        <ImageCarousel images={carouselImages} autoplaySpeed={5000} />
      </section>

      {/* Section Nos Spécialités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Nos Spécialités</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez nos plats sénégalais authentiques préparés avec des ingrédients frais et locaux
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialPlats.map((plat, index) => (
              <AnimatedFoodCard
                key={plat.id}
                plat={plat}
                delay={index * 200}
                onClick={() => navigateToPage('/menu')}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigateToPage('/menu')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              aria-label="Voir tout le menu"
            >
              Voir tout notre menu
            </button>
          </div>
        </div>
      </section>

      {/* Section Réservation */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Réservez Votre Table</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Planifiez votre repas dans notre restaurant avec une réservation simple et rapide
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigateToPage('/reserver')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              aria-label="Réserver une table"
            >
              Réserver Maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section
        className="py-16 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/images/background-pattern.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">
              Nos Services
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4" />
            <p className="text-gray-200 max-w-2xl mx-auto">
              Profitez de nos services de qualité pour une expérience culinaire exceptionnelle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: 'Commande en ligne',
                description:
                  'Commandez facilement vos plats préférés depuis notre site web et faites-vous livrer à domicile.',
                action: () => navigateToPage('/commander'),
                buttonText: 'Commander',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
                title: 'Réservation de table',
                description:
                  'Réservez une table dans notre restaurant pour profiter d’une expérience culinaire unique.',
                action: () => navigateToPage('/reserver'),
                buttonText: 'Réserver',
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'Livraison rapide',
                description:
                  'Profitez de notre service de livraison rapide pour déguster nos plats dans le confort de votre foyer.',
                action: () => navigateToPage('/commander'),
                buttonText: 'En savoir plus',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg text-white text-center transform transition-transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-200">{service.description}</p>
                <button
                  onClick={service.action}
                  className="mt-4 bg-transparent hover:bg-yellow-500 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded transition-colors duration-300"
                  aria-label={service.buttonText}
                >
                  {service.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie Photo */}
      <PhotoGallery />

      {/* Témoignages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Ce que disent nos clients</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'Le Thieboudienne était absolument délicieux ! Les saveurs étaient authentiques et le service impeccable. Je recommande vivement ce restaurant.',
                author: 'Amadou Diop',
                initial: 'A',
                rating: 5,
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
              },
              {
                quote:
                  'J’ai adoré le Yassa Poulet, très savoureux. La livraison était rapide et la nourriture encore chaude à l’arrivée. Parfait !',
                author: 'Fatou Sow',
                initial: 'F',
                rating: 4,
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
              },
              {
                quote:
                  'Le service de réservation en ligne est très pratique. Le restaurant a une ambiance chaleureuse et le Mafé était délicieux. Je reviendrai !',
                author: 'Moussa Ndiaye',
                initial: 'M',
                rating: 5,
                bgColor: 'bg-red-100',
                textColor: 'text-red-600',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md relative"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  “
                </div>
                <p className="text-gray-600 mb-4 pt-4 italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center ${testimonial.textColor} font-bold mr-3`}
                  >
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < testimonial.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-green-500 text-2xl font-bold">FOODY</span>
                <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
              </div>
              <p className="text-gray-300 mb-4">
                La meilleure plateforme de livraison de repas et de réservation de tables à Dakar
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    href: 'https://facebook.com',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    ),
                    label: 'Facebook',
                    bgColor: 'bg-blue-600 hover:bg-blue-700',
                  },
                  {
                    href: 'https://twitter.com',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    ),
                    label: 'Twitter',
                    bgColor: 'bg-blue-400 hover:bg-blue-500',
                  },
                  {
                    href: 'https://instagram.com',
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266-.058-1.644-.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                    label: 'Instagram',
                    bgColor:
                      'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600',
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${social.bgColor}`}
                    aria-label={`Suivez-nous sur ${social.label}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 border-b border-gray-500 pb-2">
                Liens rapides
              </h4>
              <ul className="space-y-2">
                {[
                  { path: '/', label: 'Accueil' },
                  { path: '/menu', label: 'Menu' },
                  { path: '/commander', label: 'Commander' },
                  { path: '/reserver', label: 'Réserver' },
                  { path: '/apropos', label: 'À propos' },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.path}
                      className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 flex items-center"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToPage(link.path);
                      }}
                    >
                      <span className="mr-2">→</span> {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 border-b border-gray-500 pb-2">
                Contact
              </h4>
              <ul className="space-y-3">
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-yellow-500 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ),
                    text: '123 Rue de Dakar, Sénégal',
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-yellow-500 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    ),
                    text: '+221 77 123 45 67',
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-yellow-500 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    text: 'info@foodyreserv.com',
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-yellow-500 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    text: 'Lun-Dim: 10h00 - 22h00',
                  },
                ].map((contact, index) => (
                  <li key={index} className="flex items-start">
                    {contact.icon}
                    <span className="text-gray-300">{contact.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 border-b border-gray-500 pb-2">
                Newsletter
              </h4>
              <p className="text-gray-300 mb-4">
                Abonnez-vous à notre newsletter pour recevoir nos dernières offres et promotions.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Inscription à la newsletter');
                }}
                className="space-y-2"
              >
                <div>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                    aria-label="Adresse email pour la newsletter"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                  aria-label="S'abonner à la newsletter"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} FOODY RESERV. Tous droits réservés.
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              {[
                { path: '/conditions', label: "Conditions d'utilisation" },
                { path: '/confidentialite', label: 'Politique de confidentialité' },
                { path: '/faq', label: 'FAQ' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="text-gray-300 hover:text-yellow-500 text-sm transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(link.path);
                  }}
                >
                  {link.label}
                  {index < 2 && <span className="mx-2 text-gray-600">|</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Bouton Retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Retour en haut de la page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage;