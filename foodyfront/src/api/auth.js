import api from './api';

export const inscription = (payload) => api.post('/api/auth/inscription', payload);
export const login = (payload) => api.post('/api/auth/connexion', payload);
