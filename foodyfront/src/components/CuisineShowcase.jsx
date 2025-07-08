import React from 'react';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import des images (assurez-vous que ces imports correspondent à vos fichiers)
import thieboudieune from '../images/thieboudieune.jpg';
import yassapoulet from '../images/yassapoulet.jpg';
import mafe from '../images/mafé.jpg';

const CuisineShowcase = () => {
  const navigate = useNavigate();
  
  const navigateToPage = (path) => {
    navigate(path);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-yellow-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-green-800">Découvrez Notre Cuisine</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">Une expérience culinaire authentique qui vous transportera au cœur du Sénégal</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          <div className="md:w-1/2 lg:w-2/5 relative">
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
              <img 
                src={thieboudieune} 
                alt="Thieboudienne" 
                className="w-full h-auto object-cover" 
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <Star className="text-yellow-500 fill-current" />
                <span className="ml-1 font-bold">4.8/5</span>
              </div>
              <p className="text-sm text-gray-600">124 avis</p>
            </div>
          </div>
          
          <div className="md:w-1/2 lg:w-3/5 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-green-700 mb-4">La Cuisine Sénégalaise</h3>
            <p className="text-gray-700 mb-4">
              La cuisine sénégalaise est réputée pour ses saveurs riches et ses plats généreux. Nos chefs utilisent des techniques traditionnelles et des ingrédients frais pour vous offrir une expérience culinaire authentique.
            </p>
            <p className="text-gray-700 mb-6">
              Chaque plat raconte une histoire et représente un aspect de la culture sénégalaise. Du Thieboudienne au Mafé en passant par le Yassa, découvrez des saveurs qui éveilleront vos papilles.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-green-50 p-2 rounded-full">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <Clock size={18} className="text-green-700" />
                </div>
                <span className="text-sm font-medium">Préparation traditionnelle</span>
              </div>
              
              <div className="flex items-center bg-amber-50 p-2 rounded-full">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                  <Star size={18} className="text-amber-700" />
                </div>
                <span className="text-sm font-medium">Ingrédients de qualité</span>
              </div>
              
              <div className="flex items-center bg-red-50 p-2 rounded-full">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <ChevronRight size={18} className="text-red-700" />
                </div>
                <span className="text-sm font-medium">Saveurs authentiques</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-full md:w-auto flex-1 bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
                <h4 className="font-bold text-green-700 mb-1">Thieboudienne</h4>
                <p className="text-sm text-gray-600">Le plat national sénégalais à base de riz, poisson et légumes</p>
              </div>
              
              <div className="w-full md:w-auto flex-1 bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <h4 className="font-bold text-yellow-600 mb-1">Yassa Poulet</h4>
                <p className="text-sm text-gray-600">Poulet mariné avec sauce aux oignons caramélisés et citron</p>
              </div>
              
              <div className="w-full md:w-auto flex-1 bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                <h4 className="font-bold text-red-600 mb-1">Mafé</h4>
                <p className="text-sm text-gray-600">Ragoût à base de viande dans une sauce crémeuse à l'arachide</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigateToPage('/menu')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
            >
              Découvrir notre menu
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CuisineShowcase;
