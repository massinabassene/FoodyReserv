import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, ShoppingBag, Calendar, MessageSquare, Mail, LogOut, User, Users } from 'lucide-react';
import {
  getAllOrders,
  getOrdersByStatus,
  countAllOrders,
  countOrdersByStatus,
  getAllReservations,
  countAllReservations,
  countReservationsByDate,
  getFeedbacksByOrder
} from '../../api/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalCommandes: 0,
    commandesEnAttente: 0,
    totalReservations: 0,
    reservationsAujourdhui: 0,
    nouveauxMessages: 0, // Placeholder (no direct endpoint)
    nouveauxCommentaires: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirection vers la page d'accueil au lieu de la page de connexion
    navigate('/');
  };
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total orders
        const totalOrdersResponse = await countAllOrders('MANAGER');
        const totalCommandes = totalOrdersResponse.data;

        // Fetch pending orders
        const pendingOrdersResponse = await countOrdersByStatus('EN_PREPARATION', 'MANAGER');
        const commandesEnAttente = pendingOrdersResponse.data;

        // Fetch total reservations
        const totalReservationsResponse = await countAllReservations('MANAGER');
        const totalReservations = totalReservationsResponse.data;

        // Fetch today's reservations
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const todayReservationsResponse = await countReservationsByDate(today, 'MANAGER');
        const reservationsAujourdhui = todayReservationsResponse.data;

        // Fetch recent orders for feedback count and recent activity
        const recentOrdersResponse = await getAllOrders('creeLe', 'desc', 'MANAGER');
        const recentOrders = recentOrdersResponse.data.slice(0, 4);

        // Fetch feedback count for comments
        let nouveauxCommentaires = 0;
        for (const order of recentOrders) {
          const feedbackResponse = await getFeedbacksByOrder(order.id, 'MANAGER');
          nouveauxCommentaires += feedbackResponse.data.length;
        }

        // Update stats
        setDashboardStats({
          totalCommandes,
          commandesEnAttente,
          totalReservations,
          reservationsAujourdhui,
          nouveauxMessages: 0, // Replace with actual endpoint if available
          nouveauxCommentaires,
        });

        // Populate recent activity
        const recentActivityData = recentOrders.map(order => ({
          type: 'commande',
          message: `Nouvelle commande #${order.id}`,
          time: `Il y a ${Math.floor((new Date() - new Date(order.creeLe)) / 60000)} minutes`,
        }));
        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Navigate to sections
  const navigateToSection = (section) => {
    navigate(`/manager/${section}`);
  };

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
              <p className="text-center text-gray-600 mt-1">Administration</p>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager" className="flex items-center text-gray-700">
                <Home size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/menu" className="flex items-center text-gray-700">
                <Menu size={20} className="mr-3" />
                <span>Gestion du menu</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/commandes" className="flex items-center text-gray-700">
                <ShoppingBag size={20} className="mr-3" />
                <span>Commandes</span>
              </a>
            </li>
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
              <a href="/manager/tables" className="flex items-center text-gray-700">
                <Users size={20} className="mr-3" />
                <span>Tables</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/reservations" className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3" />
                <span>Réservations</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/commentaires" className="flex items-center text-gray-700">
                <MessageSquare size={20} className="mr-3" />
                <span>Commentaires</span>
              </a>
            </li>
            <li className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-yellow-500">
              <a href="/manager/messages" className="flex items-center text-gray-700">
                <Mail size={20} className="mr-3" />
                <span>Messages</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4 space-y-2">
          <a href="/manager/profile" className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300">
            <User size={20} className="mr-3" />
            <span>Mon Profil</span>
          </a>
          <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition-all duration-300 personally identifiable information">
            <LogOut size={20} className="mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Commandes</h2>
              <ShoppingBag size={24} className="text-yellow-500" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalCommandes}</p>
              </div>
              <div>
                <p className="text-gray-500">En attente</p>
                <p className="text-3xl font-bold text-yellow-500">{dashboardStats.commandesEnAttente}</p>
              </div>
            </div>
            <button onClick={() => navigateToSection('commandes')} className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md transition-all duration-300">
              Voir toutes les commandes
            </button>
          </div>

          {/* Reservations Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
              <Calendar size={24} className="text-green-600" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalReservations}</p>
              </div>
              <div>
                <p className="text-gray-500">Aujourd'hui</p>
                <p className="text-3xl font-bold text-green-600">{dashboardStats.reservationsAujourdhui}</p>
              </div>
            </div>
            <button onClick={() => navigateToSection('reservations')} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300">
              Voir toutes les réservations
            </button>
          </div>

          {/* Communications Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between undergrad mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Communications</h2>
              <MessageSquare size={24} className="text-blue-500" />
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Messages</p>
                <p className="text-3xl font-bold text-blue-500">{dashboardStats.nouveauxMessages}</p>
              </div>
              <div>
                <p className="text-gray-500">Commentaires</p>
                <p className="text-3xl font-bold text-purple-500">{dashboardStats.nouveauxCommentaires}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => navigateToSection('messages')} className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all duration-300">
                Messages
              </button>
              <button onClick={() => navigateToSection('commentaires')} className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md transition-all duration-300">
                Commentaires
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;