import React, { useState, useEffect } from 'react';

const Confetti = ({ active, duration = 5000 }) => {
  const [pieces, setPieces] = useState([]);
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    setIsActive(active);
    
    if (active) {
      // Générer des confettis
      const newPieces = [];
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
      
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          y: -20 - Math.random() * 100,
          rotation: Math.random() * 360,
          size: 5 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 1 + Math.random() * 3
        });
      }
      
      setPieces(newPieces);
      
      // Désactiver après la durée spécifiée
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg)`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animation: `fall ${piece.speed}s linear forwards`
          }}
        />
      ))}
      <style jsx="true">{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 1000}deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
