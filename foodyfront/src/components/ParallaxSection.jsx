import React, { useEffect, useRef } from 'react';

const ParallaxSection = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  buttonText, 
  buttonLink,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  height = '500px'
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPosition = window.scrollY;
      const sectionPosition = sectionRef.current.offsetTop;
      const windowHeight = window.innerHeight;
      
      // Calculer la position relative pour l'effet de parallaxe
      if (scrollPosition + windowHeight > sectionPosition && scrollPosition < sectionPosition + windowHeight) {
        const yPos = (scrollPosition - sectionPosition) * 0.5;
        sectionRef.current.style.backgroundPositionY = `${yPos}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-cover bg-center bg-fixed transition-all duration-500 ease-out overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        height
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: overlayColor }}
      ></div>
      
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-700 animate-fadeInUp">
          {title}
        </h2>
        
        <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6 transform transition-all duration-700 animate-scaleIn"></div>
        
        <p className="text-xl text-white opacity-90 max-w-2xl mb-8 transform transition-all duration-700 animate-fadeInUp animation-delay-300">
          {subtitle}
        </p>
        
        {buttonText && (
          <a 
            href={buttonLink || "#"} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fadeInUp animation-delay-600"
          >
            {buttonText}
          </a>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 1s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </section>
  );
};

export default ParallaxSection;
