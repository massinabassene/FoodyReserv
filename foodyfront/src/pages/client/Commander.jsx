import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Calendar, User, LogOut, MapPin } from 'lucide-react';
import { getActiveMenus, createOrder, getOrdersByClient } from '../../api/api';

const Commander = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    optionLivraison: 'DELIVERY',
    adresse: '',
    articles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('commandes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem('user');
        const role = localStorage.getItem('role');
        
        if (!userString || role !== 'CLIENT') {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);
        const id = user.userId || user.id || user.clientId;
        if (!id) {
          setError('Utilisateur non identifié');
          setLoading(false);
          return;
        }
        setUserId(id);
        setCurrentUser(user);

        const [menusResponse, ordersResponse] = await Promise.all([
          getActiveMenus(),
          getOrdersByClient(id, 'creeLe', 'desc', 'CLIENT')
        ]);

        setMenus(Array.isArray(menusResponse.data) ? menusResponse.data : []);
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddItem = (menuId) => {
    setOrder(prev => {
      const existingItem = prev.articles.find(item => item.menuId === menuId);
      if (existingItem) {
        return {
          ...prev,
          articles: prev.articles.map(item =>
            item.menuId === menuId
              ? { ...item, quantite: item.quantite + 1 }
              : item
          )
        };
      }
      return {
        ...prev,
        articles: [...prev.articles, { menuId, quantite: 1 }]
      };
    });
  };

  const handleRemoveItem = (menuId) => {
    setOrder(prev => ({
      ...prev,
      articles: prev.articles
        .map(item =>
          item.menuId === menuId
            ? { ...item, quantite: item.quantite - 1 }
            : item
        )
        .filter(item => item.quantite > 0)
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      if (!order.adresse || order.articles.length === 0) {
        setError('Veuillez remplir l\'adresse et sélectionner au moins un article');
        return;
      }

      await createOrder(userId, order, 'CLIENT');
      navigate('/client/commandes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
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
              <p className="text-center text-gray-600 mt-1">Client</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            <li className={`px-4 py-3 ${activeSection === 'dashboard' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => navigate('/client')} className="flex items-center text-gray-700 w-full text-left">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </button>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'commandes' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => setActiveSection('commandes')} className="flex items-center text-gray-700 w-full text-left">
                <ShoppingBag size={20} className="mr-3" />
                <span>Mes Commandes</span>
              </button>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'reservations' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => navigate('/client/reservation')} className="flex items-center text-gray-700 w-full text-left">
                <Calendar size={20} className="mr-3" />
                <span>Mes Réservations</span>
              </button>
            </li>
            <li className={`px-4 py-3 ${activeSection === 'profile' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'border-l-4 border-transparent hover:bg-yellow-50 hover:border-yellow-500'} cursor-pointer transition-all duration-300`}>
              <button onClick={() => navigate('/client/profile')} className="flex items-center text-gray-700 w-full text-left">
                <User size={20} className="mr-3" />
                <span>Mon Profil</span>
              </button>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 w-full text-left">
                <LogOut size={20} className="mr-3" />
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Passer une commande</h1>
          {currentUser && (
            <div className="text-right">
              <p className="text-gray-600">Bienvenue,</p>
              <p className="font-semibold text-gray-800">{currentUser.nom || currentUser.prenom || 'Client'}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Order Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag size={24} className="mr-2 text-yellow-500" />
            Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menus.length === 0 ? (
              <p className="text-gray-500">Aucun menu disponible</p>
            ) : (
              menus.map(menu => (
                <div key={menu.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{menu.nom}</h3>
                    <p className="text-sm text-gray-600">{menu.description}</p>
                    <p className="font-semibold">{menu.prix.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveItem(menu.id)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      disabled={!order.articles.find(item => item.menuId === menu.id)}
                    >
                      -
                    </button>
                    <span>
                      {order.articles.find(item => item.menuId === menu.id)?.quantite || 0}
                    </span>
                    <button
                      onClick={() => handleAddItem(menu.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin size={24} className="mr-2 text-yellow-500" />
            Détails de livraison
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Option de livraison</label>
              <select
                value={order.optionLivraison}
                onChange={(e) => setOrder({ ...order, optionLivraison: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="DELIVERY">Livraison</option>
                <option value="PICKUP">À emporter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                value={order.adresse}
                onChange={(e) => setOrder({ ...order, adresse: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                placeholder="Entrez votre adresse"
              />
            </div>
            <button
              onClick={handleSubmitOrder}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors duration-300"
            >
              Confirmer la commande
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historique des commandes</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="font-medium">Commande #{order.id}</span>
                      <span className="text-gray-500 text-sm ml-4">
                        {new Date(order.creeLe).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.statut === 'EN_LIVRAISON' ? 'bg-blue-100 text-blue-800' : 
                      order.statut === 'LIVREE' ? 'bg-green-100 text-green-800' : 
                      order.statut === 'ANNULEE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.statut}
                    </div>
                  </div>
                  <div className="p-4">
                    {order.items && order.items.length > 0 ? (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Articles commandés</h3>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantite}x {item.nom}</span>
                              <span className="font-medium">{(item.prix * item.quantite).toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Détails de la commande</h3>
                        <p className="text-gray-600 text-sm">Détails des articles non disponibles</p>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>{order.prixTotal?.toLocaleString()} FCFA</span>
                    </div>
                    {order.adresseLivraison && (
                      <div className="mt-4 flex items-start">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse de livraison</p>
                          <p className="text-sm">{order.adresseLivraison}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commander;