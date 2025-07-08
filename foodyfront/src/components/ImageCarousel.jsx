import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/ImageCarousel.css';

const ImageCarousel = ({ images, autoplaySpeed = 5000, showDots = true, showArrows = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoplayTimerRef = useRef(null);
  const totalSlides = images.length;

  // Fonction pour passer à la diapositive suivante
  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Correspond à la durée de la transition CSS
  };

  // Fonction pour passer à la diapositive précédente
  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Correspond à la durée de la transition CSS
  };

  // Fonction pour aller à une diapositive spécifique
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Gestion de l'autoplay
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, autoplaySpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoplaySpeed]);

  // Pause de l'autoplay lors du survol
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="relative w-full h-[450px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div className="h-full">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="relative w-full h-full">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-contain md:object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fadeIn">{image.caption}</h2>
                <p className="text-lg md:text-xl mb-6 max-w-xl animate-fadeIn animation-delay-200">{image.description}</p>
                <button 
                  onClick={image.buttonAction}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 animate-fadeIn animation-delay-400"
                >
                  {image.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flèches de navigation */}
      <button 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicateurs de position */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-yellow-500 w-10' : 'bg-white bg-opacity-50'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;
