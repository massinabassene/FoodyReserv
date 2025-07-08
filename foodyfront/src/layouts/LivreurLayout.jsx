import { Routes, Route, Navigate } from 'react-router-dom';
import LivreurDashboard from '../pages/livreur/LivreurDashboard';
import CommandesLivreur from '../pages/livreur/CommandesLivreur';
import ProfileLivreur from '../pages/livreur/Profile'; // Assuming you have a ProfileLivreur component

export default function LivreurLayout() {
  return (
    <Routes>
      <Route index element={<LivreurDashboard />} />
      <Route path="commandes" element={<CommandesLivreur />} />
      <Route path="profile" element={<ProfileLivreur />} />
      <Route path="*" element={<Navigate to="/livreur" replace />} />
    </Routes>
  );
}