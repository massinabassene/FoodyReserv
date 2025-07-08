import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, User, LogOut } from 'lucide-react';
import { getOrdersByStatus, acceptDelivery, markAsDelivered } from '../../api/api';

export default function LivreurDashboard() {
  const navigate = useNavigate();
  const [commandesPret, setCommandesPret] = useState([]);
  const [commandesEnCours, setCommandesEnCours] = useState([]);
  const [commandesLivrees, setCommandesLivrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [codeConfirmation, setCodeConfirmation] = useState({});

  // Récupérer les commandes par statut au chargement
  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        const role = JSON.parse(localStorage.getItem('user'))?.role || 'LIVREUR';
        const userId = JSON.parse(localStorage.getItem('user'))?.id; // Assurez-vous que l'ID est stocké lors de la connexion
        const token = localStorage.getItem('token');
        console.log("Voici le rolee",role, "Voici l id",userId, "Voici le token",token);
        const [pretResponse, enCoursResponse, livreesResponse] = await Promise.all([
          getOrdersByStatus('PRET', 'creeLe', 'desc', role),
          getOrdersByStatus('EN_LIVRAISON', 'creeLe', 'desc', role),
          getOrdersByStatus('LIVREE', 'creeLe', 'desc', role),
        ]);
        console.log("Commandes à livrer:", pretResponse.data);
        console.log("Commandes en cours:", enCoursResponse.data);
        console.log("Commandes livrées:", livreesResponse.data);
        
        setCommandesPret(pretResponse.data);
        setCommandesEnCours(enCoursResponse.data);
        setCommandesLivrees(livreesResponse.data);
      } catch (err) {
        setError(err.response?.data || 'Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  // Accepter une commande
  const handleAcceptDelivery = async (commandeId) => {
    try {
      const role = JSON.parse(localStorage.getItem('user'))?.role || 'LIVREUR';
      const userId = JSON.parse(localStorage.getItem('user'))?.id; // ID du livreur
      await acceptDelivery(commandeId, userId, role);
      // Rafraîchir les commandes
      const pretResponse = await getOrdersByStatus('PRET', 'creeLe', 'desc', role);
      const enCoursResponse = await getOrdersByStatus('EN_LIVRAISON', 'creeLe', 'desc', role);
      setCommandesPret(pretResponse.data);
      setCommandesEnCours(enCoursResponse.data);
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de l\'acceptation de la commande');
    }
  };

  // Marquer une commande comme livrée
  const handleMarkAsDelivered = async (commandeId) => {
    const code = codeConfirmation[commandeId];
    if (!code) {
      setError('Veuillez entrer un code de confirmation');
      return;
    }
    try {
      const role = JSON.parse(localStorage.getItem('user'))?.role || 'LIVREUR';
      await markAsDelivered(commandeId, code, role);
      // Rafraîchir les commandes
      const enCoursResponse = await getOrdersByStatus('EN_LIVRAISON', 'creeLe', 'desc', role);
      const livreesResponse = await getOrdersByStatus('LIVREE', 'creeLe', 'desc', role);
      setCommandesEnCours(enCoursResponse.data);
      setCommandesLivrees(livreesResponse.data);
      setCodeConfirmation((prev) => ({ ...prev, [commandeId]: '' }));
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de la confirmation de livraison');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <img src="/images/logo.png" alt="FoodyReserv Logo" className="h-12 mr-2" />
            <div>
              <span className="text-green-700 text-2xl font-bold">FOODY</span>
              <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
              <p className="text-center text-gray-600 mt-1">Livreur</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/livreur/profile" className="flex items-center text-gray-700">
                <User size={20} className="mr-3" />
                <span>Mon Profil</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                <LogOut size={20} className="mr-3" />
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord livreur</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Commandes à livrer</h2>
              <Truck size={24} className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{commandesPret.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">En cours</h2>
              <Truck size={24} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{commandesEnCours.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Livrées</h2>
              <Truck size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{commandesLivrees.length}</p>
          </div>
        </div>

        {/* Commandes à livrer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Commandes à livrer</h2>
          <div className="space-y-4">
            {commandesPret.length > 0 ? (
              commandesPret.map((cmd) => (
                <div key={cmd.id} className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Commande #{cmd.id} - {cmd.client?.nomUtilisateur || 'Client inconnu'}</p>
                    <p className="text-sm text-gray-500">{new Date(cmd.creeLe).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleAcceptDelivery(cmd.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-all duration-300"
                  >
                    Accepter
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune commande à livrer pour le moment</p>
            )}
          </div>
        </div>

        {/* Commandes en cours */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Commandes en cours</h2>
          <div className="space-y-4">
            {commandesEnCours.length > 0 ? (
              commandesEnCours.map((cmd) => (
                <div key={cmd.id} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Commande #{cmd.id} - {cmd.client?.nomUtilisateur || 'Client inconnu'}</p>
                    <p className="text-sm text-gray-500">{new Date(cmd.creeLe).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Code de confirmation"
                      value={codeConfirmation[cmd.id] || ''}
                      onChange={(e) => setCodeConfirmation((prev) => ({ ...prev, [cmd.id]: e.target.value }))}
                      className="border border-gray-300 rounded py-1 px-2"
                    />
                    <button
                      onClick={() => handleMarkAsDelivered(cmd.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-all duration-300"
                    >
                      Marquer comme livré
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune commande en cours</p>
            )}
          </div>
        </div>

        {/* Commandes livrées */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Commandes livrées</h2>
          <div className="space-y-4">
            {commandesLivrees.length > 0 ? (
              commandesLivrees.map((cmd) => (
                <div key={cmd.id} className="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Commande #{cmd.id} - {cmd.client?.nomUtilisateur || 'Client inconnu'}</p>
                    <p className="text-sm text-gray-500">{new Date(cmd.creeLe).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune commande livrée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}