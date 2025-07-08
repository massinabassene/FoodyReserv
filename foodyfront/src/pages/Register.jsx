import { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { inscription as inscriptionApi } from '../api/auth';

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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    referralCode: '',
    agreeToTerms: false,
  });

  // Validation des champs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom de famille est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L’email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L’email n’est pas valide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^\d{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro de téléphone doit contenir au moins 7 chiffres';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Vous devez accepter les termes et conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');

    try {
      const requestData = {
        nomUtilisateur: `${formData.firstName}_${formData.lastName}`.toLowerCase(),
        motDePasse: formData.password,
        email: formData.email,
        telephone: '+221' + formData.phone,
        role: 'CLIENT',
      };

      // Appel réel à l'API d'inscription
      const { data } = await inscriptionApi(requestData);

      const username = data.nomUtilisateur || requestData.nomUtilisateur;
      setGeneratedUsername(username);
      setSuccess(`Inscription réussie ! Votre nom d'utilisateur est : ${username}. Redirection vers la connexion dans 3 secondes...`);

      // Stocker le token JWT renvoyé si présent
      if (data.token) {
        localStorage.setItem('accessToken', data.token);
      }

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (err.response) {
      const message = err.response.data?.message || "Erreur lors de l'inscription";
      setErrors({ global: message });
    } else {
      setErrors({ global: 'Erreur réseau. Veuillez vérifier votre connexion.' });
    }
      console.error('Erreur lors de l\'inscription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
      <Helmet>
        <title>FOODY RESERV - Inscription</title>
        <meta
          name="description"
          content="Créez un compte sur FOODY RESERV pour commander des plats sénégalais et réserver une table à Dakar."
        />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 p-6">
            <div className="flex items-center justify-between mb-6">
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
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors duration-300"
                aria-label="Retour à l'accueil"
              >
                <ChevronLeft size={20} />
                Retour
              </button>
            </div>

            <h1 className="text-center text-2xl font-bold mb-4">
              Inscrivez-vous sur <span className="text-yellow-500">FOODY RESERV</span>
            </h1>
            <div className="border-b-4 border-yellow-500 w-16 mx-auto mb-8" />

            <div className="space-y-4">
              <InputField
                label="Prénom"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Entrez votre prénom"
              />
              <InputField
                label="Nom de famille"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Entrez votre nom de famille"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Entrez votre email"
              />
              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <div className="flex">
                  <div className="flex items-center bg-gray-100 border border-gray-300 rounded-l-md p-3">
                     <span className="flex items-center">
                  <img src="/api/placeholder/24/16" alt="Senegal " className="mr-2" />
                  +221
                </span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="70 123 45 67"
                    className={`flex-1 p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300`}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                    className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300`}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
              <InputField
                label="Code de parrainage (facultatif)"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Entrez votre code de parrainage"
              />
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                  aria-describedby={errors.agreeToTerms ? 'terms-error' : undefined}
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                  J’accepte les{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Termes et conditions
                  </a>{' '}
                  et la{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Politique de confidentialité
                  </a>.
                </label>
              </div>
              {errors.agreeToTerms && (
                <p id="terms-error" className="text-red-500 text-sm" role="alert">
                  {errors.agreeToTerms}
                </p>
              )}

              {errors.global && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md"
                  role="alert"
                >
                  {errors.global}
                </div>
              )}
              {success && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md"
                  role="alert"
                >
                  {success}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                aria-label="S'inscrire"
              >
                {loading ? 'Inscription en cours...' : "S'inscrire"}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-700">
                  Vous avez déjà un compte ?{' '}
                  <a
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                    className="text-yellow-500 hover:underline"
                  >
                    Se connecter
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center bg-yellow-50 p-6">
            <div className="text-center">
              <img
                src="/images/aliment.png"
                alt="Ingrédients de cuisine sénégalaise"
                className="w-full h-auto object-cover rounded-md"
                loading="lazy"
              />
              <div className="mt-4">
                <h3 className="text-xl font-bold text-green-700">Cuisine avec passion</h3>
                <p className="text-gray-600">
                  Découvrez les meilleurs restaurants et réservez facilement avec FoodyReserv
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;