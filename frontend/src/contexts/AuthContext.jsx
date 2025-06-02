import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/endpoints';

// Configuration globale d'Axios
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false;

// Intercepteur pour ajouter le token à chaque requête
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour configurer le token
  const setAuthToken = (token) => {
    console.log('🔑 Configuration du token:', token ? 'Token présent' : 'Pas de token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      console.log('✅ Token configuré dans les headers et localStorage');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      console.log('❌ Token supprimé des headers et localStorage');
    }
  };

  useEffect(() => {
    console.log('🔄 Initialisation du contexte d\'authentification');
    const token = localStorage.getItem('token');
    console.log('📝 Token trouvé dans localStorage:', token ? 'Oui' : 'Non');
    
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      console.log('⚠️ Pas de token trouvé, utilisateur non connecté');
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    console.log('👤 Tentative de récupération du profil utilisateur');
    try {
      const response = await axios.get('/api/auth/me');
      console.log('✅ Profil utilisateur récupéré:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('🔑 Tentative de connexion pour:', email);
    try {
      console.log('📤 Envoi de la requête de connexion...');
      const response = await axios.post('/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false
        }
      );
      
      console.log('📥 Réponse du serveur:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (!response.data) {
        throw new Error('Réponse vide du serveur');
      }

      if (!response.data.access_token) {
        throw new Error('Token non reçu du serveur');
      }

      const { access_token, user } = response.data;
      setAuthToken(access_token);
      setUser(user);
      return user;
    } catch (error) {
      // Gestion d'erreur plus propre
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        isAxiosError: error.isAxiosError,
        code: error.code
      };
      
      console.error('❌ Erreur de connexion:', errorDetails);
      
      // Message d'erreur plus spécifique
      if (error.isAxiosError) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.');
        }
        if (error.response) {
          throw new Error(error.response.data?.message || 'Erreur lors de la connexion');
        }
        throw new Error('Erreur de connexion au serveur');
      }
      
      throw new Error('Une erreur inattendue s\'est produite');
    }
  };

  const register = async (userData) => {
    console.log('📝 Tentative d\'inscription pour:', userData.email);
    try {
      const response = await axios.post('/api/auth/register', userData);
      console.log('✅ Inscription réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', {
        message: error.message,
        response: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion de l\'utilisateur');
    setAuthToken(null);
    setUser(null);
    console.log('✅ Utilisateur déconnecté');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
