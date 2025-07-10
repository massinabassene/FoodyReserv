import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';


export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://foodyreserv-backend.up.railway.app/api/auth/connexion', {
        nomUtilisateur: identifier,
        motDePasse: password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log(response.data);
      // Décoder le token pour obtenir le rôle
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      const user = {
        role : decodedToken.role,
        email: decodedToken.email,
        telephone: decodedToken.telephone,
        userId: decodedToken.userId,
        sub: decodedToken.sub,
        nomUtilisateur: decodedToken.iat,
        exp: decodedToken.exp
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', JSON.stringify(role));
      console.log(decodedToken);
      console.log(user);
      
      // Redirection selon le rôle
      if (role === 'MANAGER') {
        navigate('/manager');
      } else if (role === 'LIVREUR') {
        navigate('/livreur');
      } else if (role === 'CLIENT') {
        navigate('/client');
      } else {
        setError('Rôle non reconnu');
      }
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-1/2 px-8 py-6 flex flex-col items-center justify-center bg-white-50">
        <div className="mb-6">
          <div className="flex items-center text-center">
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="font-medium">
                <div className="text-xl font-bold">
                  <span className="text-green-700">FOODY</span><br />
                  <span className="text-orange-500">RESERV</span>
                </div>
              </a>
            </nav>
            <img src="/images/logo.png" alt="Logo scooter" className="h-12 ml-2" />
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Commençons</h1>
          <div className="w-16 h-1 bg-yellow-500 mt-1"></div>
        </div>
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${loginMethod === 'email' ? 'bg-yellow-400' : 'bg-white'}`}
            onClick={() => setLoginMethod('email')}
          >
            Connectez-vous avec Email
          </button>
          <button
            className={`flex-1 py-2 text-center ${loginMethod === 'username' ? 'bg-yellow-400' : 'bg-white'}`}
            onClick={() => setLoginMethod('username')}
          >
            Connectez-vous avec Nom d'utilisateur
          </button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <input
              type={loginMethod === 'email' ? 'email' : 'text'}
              placeholder={loginMethod === 'email' ? 'Email' : "Nom d'utilisateur"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded py-2 px-3 pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Souviens-toi de moi</label>
            </div>
            <a href="#" className="text-sm text-gray-600">Mot de passe oublié?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Connexion</span>
              </>
            ) : (
              "S'identifier"
            )}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte?{" "}
              <a href="/Register" className="text-yellow-500">S'inscrire</a>
            </p>
          </div>
        </form>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-5 flex items-center justify-center">
        <div>
          <img src="images/aliment.png" alt="Ingrédients de cuisine italienne" className="w-full h-auto object-cover" />
          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold text-green-700">Cuisine avec passion</h3>
            <p className="text-gray-600">Découvrez les meilleurs restaurants et réservez facilement avec FoodyReserv</p>
          </div>
        </div>
      </div>
    </div>
  );
}