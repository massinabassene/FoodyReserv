import React, { useState, useEffect } from 'react';

const DeliveryAnimation = ({ isActive }) => {
  const [position, setPosition] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPosition(0);
      setShowConfetti(false);
      return;
    }

    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowConfetti(true);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  // Générer des confettis aléatoires
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 8 + 2,
    color: ['#FFD700', '#FF6347', '#7CFC00', '#FF69B4', '#1E90FF'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 1
  }));

  if (!isActive && position === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-center">Suivi de votre commande</h2>
        
        {/* Barre de progression */}
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-8 relative">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-300"
            style={{ width: `${position}%` }}
          ></div>
          
          {/* Moto de livraison */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
            style={{ left: `${position}%` }}
          >
            <div className="relative -mt-8 -ml-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <path d="M4 13.5V12h12.5L13 7.5h2.5l4.5 5h1a2 2 0 1 1 0 4h-1"></path>
                <path d="M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <path d="M16 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <path d="M9 17h5"></path>
                <path d="M9 5H4v6"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Étapes de livraison */}
        <div className="flex justify-between mb-8">
          <div className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${position > 0 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <p className="text-sm">Commande reçue</p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${position > 33 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <p className="text-sm">En préparation</p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${position > 66 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <p className="text-sm">En livraison</p>
          </div>
          <div className="text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${position >= 100 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
              4
            </div>
            <p className="text-sm">Livré</p>
          </div>
        </div>
        
        {/* Message d'état */}
        <div className="text-center mb-6">
          <p className="text-lg font-medium">
            {position < 33 && "Votre commande a été reçue et est en cours de traitement."}
            {position >= 33 && position < 66 && "Nos chefs préparent votre délicieux repas avec soin."}
            {position >= 66 && position < 100 && "Votre commande est en route ! Notre livreur sera bientôt chez vous."}
            {position >= 100 && "Votre commande a été livrée. Bon appétit !"}
          </p>
        </div>
        
        {/* Temps estimé */}
        {position < 100 && (
          <div className="text-center">
            <p className="text-gray-600">
              Temps estimé: <span className="font-bold">{Math.ceil((100 - position) / 10)} minutes</span>
            </p>
          </div>
        )}
        
        {/* Bouton de fermeture */}
        {position >= 100 && (
          <button 
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full mx-auto block transition-all duration-300"
            onClick={() => window.location.href = '/profile'}
          >
            Voir mes commandes
          </button>
        )}
        
        {/* Confettis */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map(c => (
              <div 
                key={c.id}
                className="absolute rounded-full animate-confetti"
                style={{
                  left: c.left,
                  top: c.top,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  backgroundColor: c.color,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.duration}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DeliveryAnimation;
