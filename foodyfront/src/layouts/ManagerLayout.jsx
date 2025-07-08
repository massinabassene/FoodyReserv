import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/manager/ManagerDashboard';
import MenuManager from '../pages/manager/ManagerMenu';
import CommandesManager from '../pages/manager/ManagerCommandes';
import ProfileManager from '../pages/manager/Profile'; // Assuming you have a ProfileManager component
import ReservationsManager from '../pages/manager/ManagerReservation'; // Assuming you have a ReservationsManager component
import CommentairesManager from '../pages/manager/ManagerCommentaires'; // Assuming you have a CommentairesManager component
import MessagesManager from '../pages/manager/ManagerMessages'; // Assuming you have a MessagesManager component
import TablesManager from '../pages/manager/ManagerTables'; // Assuming you have a TablesManager component
export default function ManagerLayout() {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="menu" element={<MenuManager />} />
      <Route path="commandes" element={<CommandesManager />} />
      <Route path="profile" element={<ProfileManager />} />
      <Route path="reservations" element={<ReservationsManager />} />
      <Route path="commentaires" element={<CommentairesManager />} />
      <Route path="tables" element={<TablesManager />} />
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}