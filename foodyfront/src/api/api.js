import axios from 'axios';

/*
 * Axios instance centralisée pour toute l’application.
 *
 * baseURL :
 *   - En développement, utilise REACT_APP_API_URL (défini dans .env.local, par exemple "http://localhost:8080")
 *     ou le proxy défini dans package.json ("/api/..." sans host, redirigeant vers le backend).
 *   - En production, REACT_APP_API_URL doit pointer vers l’URL publique du backend (ex. "https://api.foodyreserv.com").
 *   - Par défaut, "/api" est utilisé si REACT_APP_API_URL n’est pas défini.
 */

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://foodyreserv-backend.up.railway.app/api",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 10 second timeout
});

// Interceptor pour ajouter le token Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token ? 'Présent' : 'Absent');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Header Authorization ajouté');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

// AuthControleur
export const inscription = (payload) => api.post('/auth/inscription', payload);
export const login = (payload) => api.post('/auth/connexion', payload);

// UtilisateurControleur
export const getUserRole = () => api.get('/role');

// PlaceControleur
export const createPlace = (place, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.post('/tables', place);
};
export const getLivreurs = (role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/livreurs');
};

export const getUser = (userId, role) => {
  if (!['CLIENT', 'MANAGER', 'LIVREUR'].includes(role)) throw new Error('Accès non autorisé');
  return api.get(`/utilisateurs/${userId}`);
};

export const updateUser = (userId, data, role) => {
  if (!['CLIENT', 'MANAGER', 'LIVREUR'].includes(role)) throw new Error('Accès non autorisé');
  return api.put(`/utilisateurs/${userId}`, data);
};

export const getAllPlaces = () => api.get('/tables');
export const getPlaceById = (id) => api.get(`/tables/${id}`);
export const updatePlace = (id, place, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.put(`/tables/${id}`, place);
};
export const deletePlace = (id, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.delete(`/tables/${id}`);
};

// CommandeControleur
export const createOrder = (clientId, orderData, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.post(`/commandes/${clientId}`, orderData);
};

export const getOrderById = (id, role) => {
  if (!['CLIENT', 'MANAGER', 'LIVREUR'].includes(role)) throw new Error('Accès non autorisé');
  return api.get(`/commandes/${id}`);
};

export const getOrdersByClient = (clientId, sortBy = 'creeLe', sortDir = 'desc', role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/commandes/client/${clientId}`, { params: { sortBy, sortDir } });
};

export const updateOrder = (id, orderData, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.put(`/commandes/${id}`, orderData);
};

export const cancelOrder = (commandeId, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.delete(`/commandes/${commandeId}/annuler`);
};

export const getAllOrders = (sortBy = 'creeLe', sortDir = 'desc', role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/commandes', { params: { sortBy, sortDir } });
};

export const updateOrderStatus = (id, statut, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.put(`/commandes/${id}/statut`, { statut });
};

export const deleteOrder = (id, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.delete(`/commandes/${id}`);
};

export const getOrdersByStatus = (statut, sortBy = 'creeLe', sortDir = 'desc', role) => {
  if (!['MANAGER', 'LIVREUR'].includes(role)) throw new Error('Accès non autorisé');
  return api.get(`/commandes/statut/${statut}`, { params: { sortBy, sortDir } });
};

export const assignDelivery = (commandeId, livreurId, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.post(`/commandes/${commandeId}/assigner`, { livreurId });
};

export const getOrdersByDelivery = (livreurId, sortBy = 'creeLe', sortDir = 'desc', role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get(`/commandes/livreur/${livreurId}`, { params: { sortBy, sortDir } });
};

export const acceptDelivery = (commandeId, livreurId, role) => {
  if (role !== 'LIVREUR') throw new Error('Accès non autorisé');
  return api.post(`/commandes/${commandeId}/accepter`, { livreurId });
};

export const markAsDelivered = (commandeId, codeConfirmation, role) => {
  if (role !== 'LIVREUR') throw new Error('Accès non autorisé');
  return api.post(`/commandes/${commandeId}/livrer`, { codeConfirmation });
};

export const getTotalOrdersClient = (clientId, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/commandes/client/${clientId}/total`);
};

export const countOrdersByStatusClient = (clientId, statut, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/commandes/client/${clientId}/count/statut/${statut}`);
};

export const getTotalAllOrders = (role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/commandes/total');
};

export const countAllOrders = (role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/commandes/count');
};

export const countOrdersByStatus = (statut, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get(`/commandes/count/statut/${statut}`);
};

export const getOrdersByDeliverySelf = (sortBy = 'creeLe', sortDir = 'desc', role) => {
  if (role !== 'LIVREUR') throw new Error('Accès non autorisé');
  return api.get('/commandes/livreur/self', { params: { sortBy, sortDir } });
};

export const countOrdersByStatusDelivery = (statut, role) => {
  if (role !== 'LIVREUR') throw new Error('Accès non autorisé');
  return api.get(`/commandes/livreur/self/count/statut/${statut}`);
};

// FeedbackControleur
export const createFeedback = (feedback, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.post('/feedbacks', feedback);
};

export const getFeedbacksByOrder = (commandeId, role) => {
  if (!['CLIENT', 'MANAGER'].includes(role)) throw new Error('Accès non autorisé');
  return api.get(`/feedbacks/commande/${commandeId}`);
};

// MenuControleur
export const getActiveMenus = () => api.get('/menu');
export const getMenusByCategory = (categorie) => api.get(`/menu/categorie/${categorie}`);

export const createMenu = (menu, images, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  
  const formData = new FormData();
  
  // Ajouter les données du menu au format JSON avec le bon Content-Type
  formData.append('menu', new Blob([JSON.stringify(menu)], {
    type: 'application/json'
  }));
  
  // Ajouter les images si elles existent
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return api.post('/menu', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data' 
    },
  });
};

export const updateMenu = (id, menu, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.put(`/menu/${id}`, menu);
};

export const deleteMenu = (id, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.delete(`/menu/${id}`);
};

export const uploadMenuImages = (id, files, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return api.post(`/menu/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ReservationControleur
export const createReservation = (reservationData, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.post('/reservations', reservationData);
};

export const getReservationsByClient = (clientId, sortBy = 'date', sortDir = 'desc', role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/reservations/client/${clientId}`, { params: { sortBy, sortDir } });
};

export const getReservationById = (id, role) => {
  if (!['CLIENT', 'MANAGER'].includes(role)) throw new Error('Accès non autorisé');
  return api.get(`/reservations/${id}`);
};

export const updateReservation = (id, reservationData, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.put(`/reservations/${id}`, reservationData);
};

export const cancelReservation = (id, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.put(`/reservations/${id}/annuler`);
};

export const countReservationsByClient = (clientId, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/reservations/client/${clientId}/count`);
};

export const getTotalGroupSizeClient = (clientId, role) => {
  if (role !== 'CLIENT') throw new Error('Accès non autorisé');
  return api.get(`/reservations/client/${clientId}/total-group-size`);
};

export const getAllReservations = (sortBy = 'date', sortDir = 'desc', role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/reservations', { params: { sortBy, sortDir } });
};

export const updateReservationStatus = (id, statut, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.put(`/reservations/${id}/statut`, { statut });
};

export const deleteReservation = (id, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.delete(`/reservations/${id}`);
};

export const getReservationsByDate = (date, sortBy = 'heure', sortDir = 'asc', role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get(`/reservations/date/${date}`, { params: { sortBy, sortDir } });
};

export const countAllReservations = (role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/reservations/count');
};

export const countReservationsByDate = (date, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get(`/reservations/count/date/${date}`);
};

export const getTotalGroupSize = (role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get('/reservations/total-group-size');
};

export const countReservationsByStatus = (statut, role) => {
  if (role !== 'MANAGER') throw new Error('Accès non autorisé');
  return api.get(`/reservations/count/statut/${statut}`);
};