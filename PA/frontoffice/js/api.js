// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:3000/api';

// Classe pour gérer les appels API
class ApiService {
    // Méthode pour obtenir les headers standard avec le token si disponible
    static getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    // Méthode générique pour les requêtes
    static async fetchApi(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const headers = this.getHeaders();
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Si le token est invalide, déconnecter l'utilisateur
                if (response.status === 401) {
                    AuthService.logout();
                    window.location.href = '/login.html';
                }
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET
    static async get(endpoint) {
        return this.fetchApi(endpoint, { method: 'GET' });
    }

    // POST
    static async post(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT
    static async put(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE
    static async delete(endpoint) {
        return this.fetchApi(endpoint, { method: 'DELETE' });
    }
}

// Classe pour gérer l'authentification
class AuthService {
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static setCurrentUser(user, token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }

    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    static async login(email, password) {
        try {
            const data = await ApiService.post('/utilisateurs/login', {
                email,
                password
            });

            if (data.token) {
                this.setCurrentUser(data.user, data.token);
                return data;
            }
            throw new Error('Token non reçu');
        } catch (error) {
            throw error;
        }
    }

    static async register(userData) {
        try {
            // Créer l'utilisateur
            const user = await ApiService.post('/utilisateurs', userData);
            
            // Créer le rôle utilisateur
            await ApiService.post('/roleUtilisateur', {
                utilisateurId: user.id,
                roleId: 1 // ID du rôle "client"
            });

            // Connecter automatiquement l'utilisateur
            return this.login(userData.email, userData.motDePasse);
        } catch (error) {
            throw error;
        }
    }
}

// Middleware pour protéger les routes
function requireAuth() {
    if (!AuthService.isAuthenticated()) {
        const currentPath = window.location.pathname;
        const publicPages = ['/index.html', '/login.html', '/register.html', '/'];
        
        if (!publicPages.includes(currentPath)) {
            window.location.href = '/login.html';
            return false;
        }
    }
    return true;
}

// Exécuter le middleware sur chaque page
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
}); 