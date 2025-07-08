import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnimatedButton = ({ 
  text, 
  path, 
  icon, 
  primary = true, 
  size = 'medium',
  className = '',
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };
  
  // Classes de base
  let baseClasses = "font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center button-shine";
  
  // Classes de taille
  let sizeClasses = "";
  switch(size) {
    case 'small':
      sizeClasses = "py-2 px-4 text-sm";
      break;
    case 'large':
      sizeClasses = "py-4 px-10 text-lg";
      break;
    default:
      sizeClasses = "py-3 px-8";
  }
  
  // Classes de couleur
  let colorClasses = "";
  if (primary) {
    colorClasses = "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white";
  } else {
    colorClasses = "bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white";
  }
  
  return (
    <button 
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default AnimatedButton;
