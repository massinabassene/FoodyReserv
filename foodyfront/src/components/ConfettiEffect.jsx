import React, { useEffect, useState } from 'react';

const ConfettiEffect = ({ active, duration = 3000 }) => {
  const [isActive, setIsActive] = useState(active);
  const [confetti, setConfetti] = useState([]);
  
  // Couleurs des confettis
  const colors = ['#ffcc00', '#ff9900', '#4caf50', '#8bc34a', '#f44336', '#e91e63', '#9c27b0'];
  
  // Générer des confettis aléatoires
  useEffect(() => {
    if (isActive) {
      const newConfetti = [];
      const confettiCount = 150;
      
      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100, // Position horizontale en %
          y: -10 - Math.random() * 10, // Position verticale initiale (au-dessus de l'écran)
          size: 5 + Math.random() * 10, // Taille entre 5 et 15px
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360, // Rotation initiale
          rotationSpeed: -1 + Math.random() * 2, // Vitesse de rotation
          speedX: -2 + Math.random() * 4, // Vitesse horizontale
          speedY: 3 + Math.random() * 2, // Vitesse verticale
        });
      }
      
      setConfetti(newConfetti);
      
      // Désactiver l'effet après la durée spécifiée
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, colors]);
  
  // Animer les confettis
  useEffect(() => {
    if (!isActive || confetti.length === 0) return;
    
    const animateConfetti = () => {
      setConfetti(prevConfetti => 
        prevConfetti.map(c => ({
          ...c,
          x: c.x + c.speedX * 0.2,
          y: c.y + c.speedY * 0.2,
          rotation: c.rotation + c.rotationSpeed,
          // Réduire légèrement la vitesse pour simuler la gravité
          speedY: c.speedY + 0.01,
          // Ajouter un léger mouvement oscillatoire horizontal
          speedX: c.speedX + Math.sin(c.y * 0.1) * 0.01,
        }))
      );
    };
    
    const animationFrame = requestAnimationFrame(animateConfetti);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, confetti]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size * 0.4}px`,
            backgroundColor: c.color,
            transform: `rotate(${c.rotation}deg)`,
            opacity: Math.min(1, Math.max(0, 1 - c.y / 120)), // Disparaître progressivement
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
