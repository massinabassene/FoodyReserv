import React, { useEffect, useState } from 'react';

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Déclencher l'animation d'entrée après le montage du composant
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
