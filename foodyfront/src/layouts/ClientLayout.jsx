import { Routes, Route, Navigate } from 'react-router-dom';
import ClientDashboard from '../pages/client/ClientDashboard';
import Commander from '../pages/client/Commander';
import Reserver from '../pages/client/Reserver';
import Profile from '../pages/client/Profile';

export default function ClientLayout() {
  return (
    <Routes>
      <Route index element={<ClientDashboard />} />
      <Route path="commandes" element={<Commander />} />
      <Route path="reservations" element={<Reserver />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
}