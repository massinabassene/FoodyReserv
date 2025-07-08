import React, { useEffect, useRef } from 'react';

const AnimatedHeading = ({ 
  text, 
  tag = 'h2', 
  color = 'text-gray-800',
  size = 'text-3xl',
  className = '',
  highlight = false,
  animation = 'fadeIn', // Options: fadeIn, slideIn, typewriter, gradient
  delay = 0
}) => {
  const headingRef = useRef(null);
  
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    
    // Appliquer l'animation après un délai
    const timer = setTimeout(() => {
      heading.classList.add('animated');
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Déterminer les classes d'animation
  let animationClass = '';
  let animationStyle = {};
  
  switch (animation) {
    case 'slideIn':
      animationClass = 'transform translate-y-8 opacity-0 transition-all duration-700 ease-out';
      break;
    case 'typewriter':
      animationClass = 'typewriter';
      animationStyle = {
        overflow: 'hidden',
        borderRight: '0.15em solid #ffcc00',
        whiteSpace: 'nowrap',
        width: '0',
        animation: 'typing 3.5s steps(40, end) forwards, blink-caret 0.75s step-end infinite'
      };
      break;
    case 'gradient':
      animationClass = 'text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500 bg-size-200 bg-pos-0 transition-all duration-700';
      break;
    default: // fadeIn
      animationClass = 'opacity-0 transition-opacity duration-700 ease-out';
  }
  
  // Appliquer la mise en évidence si nécessaire
  const highlightClass = highlight ? 'relative inline-block' : '';
  
  // Créer l'élément avec le tag spécifié
  const HeadingTag = `${tag}`;
  
  return (
    <HeadingTag 
      ref={headingRef}
      className={`font-bold ${size} ${color} ${animationClass} ${highlightClass} ${className}`}
      style={animationStyle}
    >
      {text}
      {highlight && (
        <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-200 opacity-50 -z-10 transform -rotate-1"></span>
      )}
      
      <style jsx>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #ffcc00 }
        }
        
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        .bg-pos-0 {
          background-position: 0% center;
        }
        
        .animated.text-gradient {
          background-position: 200% center;
        }
        
        .animated.opacity-0 {
          opacity: 1;
        }
        
        .animated.transform {
          transform: translateY(0);
          opacity: 1;
        }
        
        .animated.typewriter {
          width: 100%;
        }
      `}</style>
    </HeadingTag>
  );
};

export default AnimatedHeading;
