import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck, MapPin, Clock, ChevronLeft, LogOut, Home, CheckCircle, Users, Mail, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet';

const DeliveryProfile = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliveryData, setDeliveryData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    avatar: '/images/delivery-avatar.png',
  });
  const [activeTab, setActiveTab] = useState('deliveries');
  const [allDeliveryAccounts, setAllDeliveryAccounts] = useState([]);

  // Données fictives pour les livraisons assignées (associées à l'email du livreur)
  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-001',
      orderId: 'ORD-001',
      status: 'À prendre en charge',
      customerName: 'Aminata Diop',
      deliveryAddress: '123 Rue de Dakar, Sénégal',
      items: [
        { name: 'Thieboudienne', quantity: 2 },
        { name: 'Yassa Poulet', quantity: 1 },
      ],
      total: 12500,
      estimatedTime: '30-45 min',
      assignedTo: 'livreur1@foodyreserv.com',
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-003',
      status: 'En livraison',
      customerName: 'Moussa Ndiaye',
      deliveryAddress: '45 Avenue de Thiès, Sénégal',
      items: [
        { name: 'Mafé', quantity: 1 },
        { name: 'Jus de Bissap', quantity: 2 },
      ],
      total: 8200,
      estimatedTime: '20-30 min',
      assignedTo: 'livreur2@foodyreserv.com',
    },
  ]);

  // Charger les données du livreur et des autres livreurs
  useEffect(() => {
    const fetchDeliveryData = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const deliveryAccounts = localStorage.getItem('deliveryAccounts');

        if (token && userData) {
          const user = JSON.parse(userData);
          if (user.role === 'LIVREUR') {
            setIsAuthenticated(true);
            setDeliveryData({
              name: user.name || 'Livreur',
              email: user.email || 'livreur@example.com',
              phone: user.phone || '+221 XX XXX XX XX',
              vehicle: user.vehicle || 'Scooter Yamaha',
              avatar: '/images/delivery-avatar.png',
            });
            if (deliveryAccounts) {
              setAllDeliveryAccounts(JSON.parse(deliveryAccounts));
            }
          } else {
            setError('Accès non autorisé. Vous n’êtes pas un livreur.');
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données du livreur:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, [navigate]);

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fonction pour retourner à la page d'accueil
  const navigateToHome = () => {
    navigate('/');
  };

  // Fonction pour mettre à jour le statut de la livraison
  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ));
  };

  // Filtrer les livraisons assignées au livreur connecté
  const assignedDeliveries = deliveries.filter(delivery => delivery.assignedTo === deliveryData.email);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Helmet>
        <title>FOODY RESERV - Profil Livreur</title>
        <meta
          name="description"
          content="Gérez vos livraisons et consultez vos informations sur FOODY RESERV."
        />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* En-tête du profil livreur */}
          <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">FOODY</span>
                <span className="text-2xl font-bold text-yellow-300">RESERV</span>
                <img
                  src="/images/logo.png"
                  alt="Logo FOODY RESERV"
                  className="h-10 ml-2"
                  loading="lazy"
                />
              </div>
              <button
                onClick={navigateToHome}
                className="flex items-center text-white hover:text-yellow-300 transition-colors duration-300"
                aria-label="Retour à l'accueil"
              >
                <ChevronLeft size={20} />
                Retour
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 md:mb-0 md:mr-6">
                <img 
                  src={deliveryData.avatar || 'https://via.placeholder.com/100'} 
                  alt="Avatar du livreur" 
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{deliveryData.name}</h1>
                <p className="text-white text-opacity-80">{deliveryData.email}</p>
              </div>
              <div className="ml-auto flex space-x-2 mt-4 md:mt-0">
                <button 
                  onClick={navigateToHome}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                  aria-label="Retour à l'accueil"
                >
                  <Home size={18} className="mr-2" />
                  Accueil
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                  aria-label="Se déconnecter"
                >
                  <LogOut size={18} className="mr-2" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button 
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${activeTab === 'profile' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('profile')}
                aria-label="Afficher le profil"
              >
                <User size={18} className="inline mr-2" />
                Mon Profil
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${activeTab === 'deliveries' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('deliveries')}
                aria-label="Afficher les livraisons"
              >
                <Truck size={18} className="inline mr-2" />
                Mes Livraisons
              </button>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Informations du livreur</h2>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{deliveryData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{deliveryData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{deliveryData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Truck className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Véhicule</p>
                        <p className="font-medium">{deliveryData.vehicle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Livraisons */}
            {activeTab === 'deliveries' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Livraisons assignées</h2>
                {assignedDeliveries.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Truck size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune livraison assignée pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {assignedDeliveries.map((delivery) => (
                      <div key={delivery.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="font-medium">Livraison #{delivery.id}</span>
                            <span className="text-gray-500 text-sm ml-4">Commande #{delivery.orderId}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            delivery.status === 'À prendre en charge' ? 'bg-yellow-100 text-yellow-800' :
                            delivery.status === 'En livraison' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {delivery.status}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Détails de la commande</h3>
                            <div className="space-y-2">
                              <p><span className="font-medium">Client :</span> {delivery.customerName}</p>
                              {delivery.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.quantity}x {item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>{delivery.total} FCFA</span>
                          </div>
                          <div className="mt-4 flex items-start">
                            <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Adresse de livraison</p>
                              <p>{delivery.deliveryAddress}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center">
                            <Clock className="w-5 h-5 text-gray-500 mr-2" />
                            <p className="text-sm">Temps estimé : <span className="font-medium">{delivery.estimatedTime}</span></p>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            {delivery.status === 'À prendre en charge' && (
                              <button
                                onClick={() => updateDeliveryStatus(delivery.id, 'En livraison')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                                aria-label="Prendre en charge la livraison"
                              >
                                <CheckCircle size={18} className="mr-2" />
                                Prendre en charge
                              </button>
                            )}
                            {delivery.status === 'En livraison' && (
                              <button
                                onClick={() => updateDeliveryStatus(delivery.id, 'Livré')}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                                aria-label="Marquer comme livré"
                              >
                                <CheckCircle size={18} className="mr-2" />
                                Marquer comme livré
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;