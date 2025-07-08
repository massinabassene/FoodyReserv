import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck, LogOut, Edit, MapPin, Phone, Mail } from 'lucide-react';
import { updateUser, getUser } from '../../api/api';

const Profile = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '/images/avatar.png'
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (token && user) {
        try {
          setIsAuthenticated(true);
          const response = await getUser(user.id || user.userId, 'LIVREUR');
          console.log("voila ", user);
          const { nomUtilisateur, email, telephone, adresse } = response.data;
          const updatedUser = {
            id: user.id || user.userId,
            nomUtilisateur,
            email,
            telephone,
            adresse,
            role: user.role
          };
          setUserData({
            name: nomUtilisateur || 'Utilisateur',
            email: email || 'email@example.com',
            phone: telephone || '+221 XX XXX XX XX',
            address: adresse || 'Dakar, Sénégal',
            avatar: '/images/avatar.png'
          });
          setFormData({
            name: nomUtilisateur || 'Utilisateur',
            email: email || 'email@example.com',
            phone: telephone || '+221 XX XXX XX XX',
            address: adresse || 'Dakar, Sénégal',
            avatar: '/images/avatar.png'
          });
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Erreur lors du chargement des données utilisateur:', err);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit updated user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log("voila ", user);
      await updateUser(user.id || user.userId, {
        nomUtilisateur: formData.name,
        email: formData.email,
        telephone: formData.phone,
        adresse: formData.address
      }, 'LIVREUR');
      setUserData({ ...formData });
      setEditMode(false);
      setSuccess('Informations mises à jour avec succès.');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        nomUtilisateur: formData.name,
        email: formData.email,
        telephone: formData.phone,
        adresse: formData.address
      }));
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour des informations.');
    }
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
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
            <li className="px-4 py-3 bg-yellow-50 cursor-pointer transition-all duration-300 border-l-4 border-yellow-500">
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
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-6 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src={userData.avatar || 'https://via.placeholder.com/100'} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                  />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-white text-opacity-80">{userData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
              {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">{success}</div>}
              {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                {editMode ? (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-500 mb-1">Nom complet</label>
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-500 mr-3" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-500 mb-1">Email</label>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-500 mb-1">Téléphone</label>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-500 mr-3" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-500 mb-1">Adresse</label>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
                      >
                        <Edit size={18} className="mr-2" />
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{userData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{userData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{userData.address}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-between">
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                      >
                        <LogOut size={18} className="mr-2" />
                        Se déconnecter
                      </button>
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-all duration-300"
                      >
                        <Edit size={18} className="mr-2" />
                        Modifier mes informations
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Profile;