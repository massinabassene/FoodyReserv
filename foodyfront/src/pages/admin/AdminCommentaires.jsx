import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Star, Trash, Search, Reply, X, Check } from 'lucide-react';

const AdminCommentaires = () => {
  const navigate = useNavigate();
  
  // Données statiques pour les commentaires
  const [commentaires, setCommentaires] = useState([
    {
      id: 1,
      client: "Mamadou Diop",
      email: "mamadou.diop@example.com",
      date: "2025-05-17T14:30:00",
      plat: "Thieboudienne",
      note: 5,
      contenu: "Excellent plat ! Le poisson était frais et les légumes parfaitement cuits. Je recommande vivement !",
      reponse: "",
      lu: true
    },
    {
      id: 2,
      client: "Sophie Ndour",
      email: "sophie.ndour@example.com",
      date: "2025-05-16T19:45:00",
      plat: "Yassa Poulet",
      note: 4,
      contenu: "Très bon plat, la sauce était délicieuse. J'aurais juste aimé un peu plus d'oignons.",
      reponse: "Merci pour votre retour Sophie ! Nous prenons note de votre suggestion concernant les oignons.",
      lu: true
    },
    {
      id: 3,
      client: "Abdou Fall",
      email: "abdou.fall@example.com",
      date: "2025-05-15T13:20:00",
      plat: "Mafé",
      note: 3,
      contenu: "Le plat était bon mais la viande un peu trop cuite à mon goût. La sauce arachide était excellente cependant.",
      reponse: "",
      lu: false
    },
    {
      id: 4,
      client: "Mariama Sow",
      email: "mariama.sow@example.com",
      date: "2025-05-14T20:10:00",
      plat: "Pastels",
      note: 5,
      contenu: "Les pastels étaient parfaits ! Croustillants à l'extérieur et bien garnis à l'intérieur. La sauce piquante qui les accompagne est divine !",
      reponse: "",
      lu: false
    }
  ]);
  
  // État pour le modal de réponse
  const [showModal, setShowModal] = useState(false);
  const [currentCommentaire, setCurrentCommentaire] = useState(null);
  const [reponse, setReponse] = useState("");
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNote, setFilterNote] = useState("Toutes");
  const [filterLu, setFilterLu] = useState("Tous");
  
  // Fonction pour filtrer les commentaires
  const filteredCommentaires = commentaires.filter(commentaire => {
    const matchesSearch = 
      commentaire.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      commentaire.plat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commentaire.contenu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNote = filterNote === "Toutes" || commentaire.note.toString() === filterNote;
    const matchesLu = filterLu === "Tous" || 
                     (filterLu === "Non lus" && !commentaire.lu) || 
                     (filterLu === "Lus" && commentaire.lu);
    
    return matchesSearch && matchesNote && matchesLu;
  });
  
  // Fonction pour marquer un commentaire comme lu
  const marquerCommeLu = (id) => {
    setCommentaires(commentaires.map(commentaire => 
      commentaire.id === id ? {...commentaire, lu: true} : commentaire
    ));
  };
  
  // Fonction pour supprimer un commentaire
  const supprimerCommentaire = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      setCommentaires(commentaires.filter(commentaire => commentaire.id !== id));
    }
  };
  
  // Fonction pour ouvrir le modal de réponse
  const ouvrirModalReponse = (commentaire) => {
    setCurrentCommentaire(commentaire);
    setReponse(commentaire.reponse);
    setShowModal(true);
    
    // Marquer comme lu si ce n'est pas déjà fait
    if (!commentaire.lu) {
      marquerCommeLu(commentaire.id);
    }
  };
  
  // Fonction pour envoyer une réponse
  const envoyerReponse = () => {
    setCommentaires(commentaires.map(commentaire => 
      commentaire.id === currentCommentaire.id ? {...commentaire, reponse: reponse} : commentaire
    ));
    setShowModal(false);
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Rendu des étoiles pour la note
  const renderEtoiles = (note) => {
    const etoiles = [];
    for (let i = 1; i <= 5; i++) {
      etoiles.push(
        <Star 
          key={i} 
          size={16} 
          className={i <= note ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
        />
      );
    }
    return <div className="flex">{etoiles}</div>;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
          <div className="flex items-center justify-center">
            <span className="text-green-700 text-2xl font-bold">FOODY</span>
            <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
          </div>
          </div>
          <p className="text-center text-gray-600 mt-2">Administration</p>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin" className="flex items-center text-gray-700">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/menu" className="flex items-center text-gray-700">
                <Menu size={20} className="mr-3" />
                <span>Gestion du menu</span>
              </a>
            </li>
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
              <a href="/admin/commandes" className="flex items-center text-gray-700">
                <ShoppingBag size={20} className="mr-3" />
                <span>Commandes</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/reservations" className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3" />
                <span>Réservations</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/commentaires" className="flex items-center text-gray-700">
                <MessageSquare size={20} className="mr-3" />
                <span>Commentaires</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/admin/messages" className="flex items-center text-gray-700">
                <Mail size={20} className="mr-3" />
                <span>Messages</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 border-t p-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-red-500 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commentaires</h1>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher par client, plat ou contenu..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">Note:</label>
                <select
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={filterNote}
                  onChange={(e) => setFilterNote(e.target.value)}
                >
                  <option value="Toutes">Toutes</option>
                  <option value="5">5 étoiles</option>
                  <option value="4">4 étoiles</option>
                  <option value="3">3 étoiles</option>
                  <option value="2">2 étoiles</option>
                  <option value="1">1 étoile</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">Statut:</label>
                <select
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={filterLu}
                  onChange={(e) => setFilterLu(e.target.value)}
                >
                  <option value="Tous">Tous</option>
                  <option value="Non lus">Non lus</option>
                  <option value="Lus">Lus</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des commentaires */}
        <div className="space-y-4">
          {filteredCommentaires.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              Aucun commentaire trouvé
            </div>
          ) : (
            filteredCommentaires.map(commentaire => (
              <div 
                key={commentaire.id} 
                className={`bg-white rounded-lg shadow-md p-6 ${!commentaire.lu ? 'border-l-4 border-yellow-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      {commentaire.client}
                      {!commentaire.lu && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Nouveau
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-500">{commentaire.email}</p>
                    <p className="text-gray-500 text-sm">{formatDate(commentaire.date)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-gray-700 font-medium mb-1">Plat: {commentaire.plat}</p>
                    {renderEtoiles(commentaire.note)}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{commentaire.contenu}</p>
                </div>
                
                {commentaire.reponse && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Votre réponse:</p>
                    <p className="text-gray-700">{commentaire.reponse}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => ouvrirModalReponse(commentaire)}
                    className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md border border-blue-600 hover:border-blue-800 transition-all duration-300"
                  >
                    <Reply size={16} className="mr-1" />
                    {commentaire.reponse ? 'Modifier la réponse' : 'Répondre'}
                  </button>
                  <button 
                    onClick={() => supprimerCommentaire(commentaire.id)}
                    className="flex items-center text-red-600 hover:text-red-800 px-3 py-1 rounded-md border border-red-600 hover:border-red-800 transition-all duration-300"
                  >
                    <Trash size={16} className="mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Modal de réponse */}
      {showModal && currentCommentaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Répondre au commentaire
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{currentCommentaire.client}</h3>
                  <p className="text-gray-500 text-sm">{formatDate(currentCommentaire.date)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-700 font-medium mb-1">Plat: {currentCommentaire.plat}</p>
                  {renderEtoiles(currentCommentaire.note)}
                </div>
              </div>
              <p className="text-gray-700">{currentCommentaire.contenu}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre réponse</label>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                rows="6"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Écrivez votre réponse ici..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={envoyerReponse}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
                disabled={!reponse.trim()}
              >
                <Check size={20} className="mr-2" />
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommentaires;
