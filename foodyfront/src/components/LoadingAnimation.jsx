import React, { useEffect } from 'react';

const LoadingAnimation = ({ onFinished }) => {
  useEffect(() => {
    // Simuler un temps de chargement puis appeler onFinished
    const timer = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Chargement...</h2>
      </div>
    </div>
  );
};

export default LoadingAnimation;
