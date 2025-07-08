import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Composant pour les champs de formulaire
const InputField = ({ label, name, type, value, onChange, error, placeholder, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300`}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} className="text-red-500 text-sm" role="alert">
        {error}
      </p>
    )}
  </div>
);

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Validation des champs
  const validateForm = () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('L’email n’est pas valide');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Simuler une requête API pour envoyer un lien de réinitialisation
      // À remplacer par une vraie requête API dans un environnement de production :
      // const response = await fetch('http://localhost:8080/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      console.log('Envoi de la demande de réinitialisation pour:', email);

      // Simuler une réponse réussie
      setMessage('Un lien de réinitialisation a été envoyé à votre adresse email.');
      setEmail('');

      // Redirection optionnelle après un délai
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      setError('Erreur lors de l’envoi de la demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
      <Helmet>
        <title>FOODY RESERV - Réinitialisation du mot de passe</title>
        <meta
          name="description"
          content="Réinitialisez votre mot de passe pour accéder à FOODY RESERV et commander des plats sénégalais."
        />
      </Helmet>

      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <a href="/">
            <div className="flex items-center">
              <span className="text-green-700 text-2xl font-bold">FOODY</span>
              <span className="text-yellow-500 text-2xl font-bold">RESERV</span>
              <img
                src="/images/logo.png"
                alt="Logo FOODY RESERV"
                className="h-10 ml-2"
                loading="lazy"
              />
            </div>
          </a>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
          <div className="w-16 h-1 bg-yellow-500 mt-1 mx-auto"></div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <InputField
            label="Adresse email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="Entrez votre email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            aria-label="Envoyer le lien de réinitialisation"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                Envoi...
              </>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Retour à{' '}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              className="text-yellow-500 hover:underline"
            >
              la connexion
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;