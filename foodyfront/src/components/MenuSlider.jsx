import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import des images
import thieboudieune from '../images/thieboudieune.jpg';
import yassapoulet from '../images/yassapoulet.jpg';
import mafe from '../images/mafé.jpg';
import thiakry from '../images/thiakry.jpg';

const MenuSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Données des slides
  const slides = [
    {
      id: 1,
      title: "Thieboudienne",
      subtitle: "Le plat national sénégalais",
      description: "Un délicieux plat à base de riz, poisson et légumes, cuit dans une sauce tomate épicée.",
      image: thieboudieune,
      price: "3500 FCFA",
      rating: 4.8,
      reviews: 124,
      color: "from-green-500 to-green-700"
    },
    {
      id: 2,
      title: "Yassa Poulet",
      subtitle: "Saveurs acidulées et douces",
      description: "Poulet mariné grillé servi avec une sauce aux oignons caramélisés et citron, accompagné de riz blanc.",
      image: yassapoulet,
      price: "3200 FCFA",
      rating: 4.6,
      reviews: 98,
      color: "from-yellow-500 to-yellow-700"
    },
    {
      id: 3,
      title: "Mafé",
      subtitle: "Onctueux et savoureux",
      description: "Ragoût à base de viande dans une sauce crémeuse à l'arachide, servi avec du riz.",
      image: mafe,
      price: "3000 FCFA",
      rating: 4.7,
      reviews: 87,
      color: "from-red-500 to-red-700"
    },
    {
      id: 4,
      title: "Thiakry",
      subtitle: "Douceur rafraîchissante",
      description: "Dessert à base de couscous de mil sucré, mélangé avec du yaourt et parfumé à la fleur d'oranger.",
      image: thiakry,
      price: "1200 FCFA",
      rating: 4.4,
      reviews: 62,
      color: "from-purple-500 to-purple-700"
    }
  ];

  // Fonction pour passer au slide suivant
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Fonction pour revenir au slide précédent
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Changement automatique des slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Commander un plat
  const commanderPlat = (platId) => {
    // Rediriger vers la page de commande avec l'ID du plat
    navigate('/commander', { state: { platId } });
  };

  return (
    <div className="w-full bg-gray-50 py-8 mb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Nos Spécialités du Moment</h2>
        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
        
        <div className="relative">
          {/* Slides */}
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image */}
                    <div className="md:w-1/2 relative">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-64 md:h-96 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full shadow-md">
                        <span className="font-bold text-gray-800">{slide.price}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-1/2 p-8 bg-gradient-to-r ${slide.color} text-white flex flex-col justify-center`}>
                      <div className="mb-2 flex items-center">
                        <div className="flex text-yellow-300 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < Math.floor(slide.rating) ? "currentColor" : "none"} 
                            />
                          ))}
                        </div>
                        <span className="text-sm">{slide.rating} ({slide.reviews} avis)</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-1">{slide.title}</h3>
                      <p className="text-lg opacity-90 mb-3">{slide.subtitle}</p>
                      <p className="mb-6 opacity-90">{slide.description}</p>
                      <button 
                        onClick={() => commanderPlat(slide.id)}
                        className="bg-white text-gray-800 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors self-start"
                      >
                        Commander maintenant
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6">
            {slides.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full ${currentSlide === index ? 'bg-yellow-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSlider;
