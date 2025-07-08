import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, Trash, Search, Reply, X, Check } from 'lucide-react';

const AdminMessages = () => {
  const navigate = useNavigate();
  
  // Données statiques pour les messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      nom: "Cheikh Diallo",
      email: "cheikh.diallo@example.com",
      telephone: "77 888 99 00",
      date: "2025-05-18T09:15:00",
      sujet: "Question sur les réservations de groupe",
      message: "Bonjour, je souhaiterais savoir s'il est possible de réserver pour un groupe de 15 personnes pour un événement d'entreprise la semaine prochaine. Quelles sont les options disponibles ? Merci d'avance pour votre réponse.",
      reponse: "",
      lu: false
    },
    {
      id: 2,
      nom: "Aminata Seck",
      email: "aminata.seck@example.com",
      telephone: "76 111 22 33",
      date: "2025-05-17T14:30:00",
      sujet: "Demande de partenariat",
      message: "Bonjour, je représente une entreprise locale et nous aimerions discuter d'un possible partenariat avec votre restaurant pour des événements réguliers. Pouvez-vous me contacter pour en discuter davantage ? Cordialement.",
      reponse: "Bonjour Aminata, nous serions ravis de discuter de ce partenariat. Notre responsable des événements vous contactera dans les 24 heures. Merci de votre intérêt !",
      lu: true
    },
    {
      id: 3,
      nom: "Ousmane Ndiaye",
      email: "ousmane.ndiaye@example.com",
      telephone: "70 444 55 66",
      date: "2025-05-16T18:45:00",
      sujet: "Suggestion de menu",
      message: "Bonjour, je suis un client régulier et j'adore vos plats. J'aimerais suggérer l'ajout de quelques plats végétariens au menu, car j'ai des amis végétariens qui aimeraient venir manger chez vous. Merci de prendre en considération cette suggestion.",
      reponse: "",
      lu: true
    },
    {
      id: 4,
      nom: "Fatou Diop",
      email: "fatou.diop@example.com",
      telephone: "78 777 88 99",
      date: "2025-05-15T10:20:00",
      sujet: "Problème avec ma commande",
      message: "Bonjour, j'ai passé une commande hier soir (commande #1082) et il manquait un des plats que j'avais commandés. Pourriez-vous vérifier et me contacter rapidement ? Merci.",
      reponse: "",
      lu: false
    }
  ]);
  
  // État pour le modal de réponse
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [reponse, setReponse] = useState("");
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLu, setFilterLu] = useState("Tous");
  
  // Fonction pour filtrer les messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLu = filterLu === "Tous" || 
                     (filterLu === "Non lus" && !message.lu) || 
                     (filterLu === "Lus" && message.lu);
    
    return matchesSearch && matchesLu;
  });
  
  // Fonction pour marquer un message comme lu
  const marquerCommeLu = (id) => {
    setMessages(messages.map(message => 
      message.id === id ? {...message, lu: true} : message
    ));
  };
  
  // Fonction pour supprimer un message
  const supprimerMessage = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      setMessages(messages.filter(message => message.id !== id));
    }
  };
  
  // Fonction pour ouvrir le modal de réponse
  const ouvrirModalReponse = (message) => {
    setCurrentMessage(message);
    setReponse(message.reponse);
    setShowModal(true);
    
    // Marquer comme lu si ce n'est pas déjà fait
    if (!message.lu) {
      marquerCommeLu(message.id);
    }
  };
  
  // Fonction pour envoyer une réponse
  const envoyerReponse = () => {
    setMessages(messages.map(message => 
      message.id === currentMessage.id ? {...message, reponse: reponse} : message
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
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
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Messages</h1>
        
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative mb-4 md:mb-0 md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher par nom, sujet ou contenu..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
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
        
        {/* Liste des messages */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              Aucun message trouvé
            </div>
          ) : (
            filteredMessages.map(message => (
              <div 
                key={message.id} 
                className={`bg-white rounded-lg shadow-md p-6 ${!message.lu ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      {message.nom}
                      {!message.lu && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Nouveau
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-500">{message.email} | {message.telephone}</p>
                    <p className="text-gray-500 text-sm">{formatDate(message.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Sujet: {message.sujet}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">{message.message}</p>
                </div>
                
                {message.reponse && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Votre réponse:</p>
                    <p className="text-gray-700">{message.reponse}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => ouvrirModalReponse(message)}
                    className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md border border-blue-600 hover:border-blue-800 transition-all duration-300"
                  >
                    <Reply size={16} className="mr-1" />
                    {message.reponse ? 'Modifier la réponse' : 'Répondre'}
                  </button>
                  <button 
                    onClick={() => supprimerMessage(message.id)}
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
      {showModal && currentMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Répondre au message
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
                  <h3 className="font-semibold text-gray-800">{currentMessage.nom}</h3>
                  <p className="text-gray-500">{currentMessage.email} | {currentMessage.telephone}</p>
                  <p className="text-gray-500 text-sm">{formatDate(currentMessage.date)}</p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Sujet: {currentMessage.sujet}</p>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{currentMessage.message}</p>
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

export default AdminMessages;
