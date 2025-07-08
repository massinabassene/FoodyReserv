import React from 'react';
import { Flame, Award, Clock, Heart } from 'lucide-react';

const FoodBadge = ({ type, text }) => {
  let badgeClass = '';
  let icon = null;
  
  switch (type) {
    case 'popular':
      badgeClass = 'bg-gradient-to-r from-orange-500 to-red-500';
      icon = <Flame size={14} className="mr-1" />;
      break;
    case 'best':
      badgeClass = 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      icon = <Award size={14} className="mr-1" />;
      break;
    case 'new':
      badgeClass = 'bg-gradient-to-r from-green-500 to-emerald-600';
      icon = <Clock size={14} className="mr-1" />;
      break;
    case 'favorite':
      badgeClass = 'bg-gradient-to-r from-pink-500 to-rose-500';
      icon = <Heart size={14} className="mr-1" />;
      break;
    default:
      badgeClass = 'bg-gradient-to-r from-blue-500 to-indigo-600';
  }
  
  return (
    <span className={`${badgeClass} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md`}>
      {icon}
      {text}
    </span>
  );
};

export default FoodBadge;
