import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import des images
import thieboudieune from '../images/thieboudieune.jpg';
import yassapoulet from '../images/yassapoulet.jpg';
import mafe from '../images/mafé.jpg';
import thiakry from '../images/thiakry.jpg';

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Données des images de la galerie
  const galleryImages = [
    {
      id: 1,
      src: thieboudieune,
      alt: "Thieboudienne",
      title: "Thieboudienne",
      description: "Le plat national sénégalais à base de riz, poisson et légumes"
    },
    {
      id: 2,
      src: yassapoulet,
      alt: "Yassa Poulet",
      title: "Yassa Poulet",
      description: "Poulet mariné grillé avec sauce aux oignons caramélisés et citron"
    },
    {
      id: 3,
      src: mafe,
      alt: "Mafé",
      title: "Mafé",
      description: "Ragoût à base de viande dans une sauce crémeuse à l'arachide"
    },
    {
      id: 4,
      src: thiakry,
      alt: "Thiakry",
      title: "Thiakry",
      description: "Dessert à base de couscous de mil sucré et yaourt"
    },
    // Vous pouvez ajouter plus d'images ici
  ];

  // Ouvrir l'image en mode plein écran
  const openImage = (index) => {
    setSelectedImage(galleryImages[index]);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden'; // Empêcher le défilement
  };

  // Fermer l'image
  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Réactiver le défilement
  };

  // Navigation vers l'image précédente
  const prevImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  // Navigation vers l'image suivante
  const nextImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Notre Galerie Photo</h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos délicieux plats sénégalais à travers cette galerie de photos
          </p>
        </div>

        {/* Grille de photos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => openImage(index)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{image.title}</h3>
                <p className="text-white/90 text-sm">{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Viewer plein écran */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={closeImage}
            >
              <X size={24} />
            </button>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="max-w-4xl max-h-[80vh] relative">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
                <h3 className="font-bold text-xl">{selectedImage.title}</h3>
                <p className="text-white/90">{selectedImage.description}</p>
              </div>
            </div>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_, index) => (
                <button 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(galleryImages[index]);
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
