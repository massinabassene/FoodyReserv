import React, { useEffect, useRef } from 'react';
import '../styles/AnimatedFoodCard.css';

const AnimatedFoodCard = ({ plat, onClick, delay = 0 }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      className="animated-food-card" 
      ref={cardRef}
      onClick={onClick}
    >
      <div className="food-card-image-container">
        <img 
          src={plat.image} 
          alt={plat.nom} 
          className="food-card-image"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/200"; 
            e.target.alt = "Image non disponible";
          }}
        />
        <div className="food-card-rating">
          <span className="star">★</span>
          <span>{plat.rating}</span>
        </div>
        <div className="food-card-category">{plat.categorie}</div>
      </div>
      
      <div className="food-card-content">
        <h3 className="food-card-title">{plat.nom}</h3>
        <p className="food-card-description">{plat.description}</p>
        <div className="food-card-footer">
          <span className="food-card-price">{plat.prix.toLocaleString()} FCFA</span>
          <button className="food-card-button">
            Commander
            <span className="food-card-button-icon">→</span>
          </button>
        </div>
      </div>
      
      <div className="food-card-shine"></div>
      <div className="food-card-hover-effect"></div>
    </div>
  );
};

export default AnimatedFoodCard;
