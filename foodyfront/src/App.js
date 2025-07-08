import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import ManagerLayout from './layouts/ManagerLayout';
import LivreurLayout from './layouts/LivreurLayout';
import { useEffect, useState } from 'react';
import { getUserRole } from './utils/auth'; // à créer pour décoder le JWT ou appeler l'API
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Apropos from './pages/Apropos';
import ContactPage from './pages/ContactPage';
import Menu from './pages/Menu';
import LoadingAnimation from './components/LoadingAnimation';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

function App() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    // Récupérer le rôle de l'utilisateur connecté
    setRole(getUserRole());
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingAnimation />;

  return (
    <div>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/apropos" element={<PageTransition><Apropos /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />

          {/* Layouts et routes selon le rôle */}
          <Route path="/client/*" element={<ClientLayout />} />
          <Route path="/manager/*" element={<ManagerLayout />} />
          <Route path="/livreur/*" element={<LivreurLayout />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;