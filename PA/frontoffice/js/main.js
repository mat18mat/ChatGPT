// Configuration API
const API_BASE_URL = "http://localhost:4000/api" // À adapter selon votre backend

// Gestion de l'authentification
let currentUser = null
let authToken = localStorage.getItem("authToken")

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  // Vérifier l'authentification
  if (authToken) {
    try {
      currentUser = await getCurrentUser()
      updateUserInterface()
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error)
      logout()
    }
  }

  // Initialiser les événements
  initializeEventListeners()

  // Charger les données de la page actuelle
  loadPageData()
}

function initializeEventListeners() {
  // Menu mobile
  const mobileMenuBtn = document.getElementById("mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Menu profil
  const profileBtn = document.getElementById("profile-btn")
  const profileMenu = document.getElementById("profile-menu")

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      profileMenu.classList.toggle("hidden")
    })

    // Fermer le menu en cliquant ailleurs
    document.addEventListener("click", () => {
      profileMenu.classList.add("hidden")
    })
  }

  // Panier
  const cartBtn = document.getElementById("cart-btn")
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart)
  }
}

// Fonctions API
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    if (response.status === 401) {
      logout()
      throw new Error("Non autorisé")
    }
    throw new Error(`Erreur API: ${response.status}`)
  }

  return response.json()
}

async function getCurrentUser() {
  return await apiCall("/auth/me")
}

async function getUserStats() {
  return await apiCall("/users/stats")
}

// Gestion de l'authentification
function logout() {
  localStorage.removeItem("authToken")
  authToken = null
  currentUser = null
  window.location.href = "login.html"
}

function updateUserInterface() {
  if (currentUser) {
    const userNameElement = document.getElementById("user-name")
    if (userNameElement) {
      userNameElement.textContent = currentUser.name || "Client"
    }
  }
}

// Chargement des données selon la page
async function loadPageData() {
  const currentPage = getCurrentPage()

  switch (currentPage) {
    case "index":
      await loadDashboardStats()
      break
    case "annonces":
      await loadAnnouncements()
      break
    case "dashboard":
      await loadFullDashboard()
      break
    case "historique":
      await loadHistory()
      break
    case "abonnements":
      await loadSubscriptions()
      break
  }
}

function getCurrentPage() {
  const path = window.location.pathname
  const page = path.split("/").pop().split(".")[0]
  return page || "index"
}

// Chargement des statistiques pour la page d'accueil
async function loadDashboardStats() {
  try {
    showFeedback('Chargement des statistiques...', 'info');
    const stats = await getUserStats()

    // Mettre à jour les statistiques
    updateElement("total-deliveries", stats.totalDeliveries || 0)
    updateElement("total-spent", `${stats.totalSpent || 0}€`)
    updateElement("avg-rating", stats.averageRating || 0)
    updateElement("eco-points", stats.ecoPoints || 0)
  } catch (error) {
    showFeedback('Erreur lors du chargement des statistiques', 'error');
  }
}

// Utilitaires
function updateElement(id, content) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = content
  }
}

function showNotification(message, type = "info") {
  // Créer une notification toast
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`
  notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${getNotificationIcon(type)} mr-3"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">&times;</button>
        </div>
    `

  document.body.appendChild(notification)

  // Supprimer automatiquement après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

function getNotificationClasses(type) {
  switch (type) {
    case "success":
      return "bg-green-500 text-white"
    case "error":
      return "bg-red-500 text-white"
    case "warning":
      return "bg-yellow-500 text-white"
    default:
      return "bg-blue-500 text-white"
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle"
    case "error":
      return "fa-exclamation-circle"
    case "warning":
      return "fa-exclamation-triangle"
    default:
      return "fa-info-circle"
  }
}

// Fonctions globales
function openProviderSearch() {
  // Ouvrir une modal de recherche de prestataires
  showNotification("Fonction de recherche de prestataires en développement", "info")
}

// Formatage des dates
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Formatage des prix
function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

// Déclarations des fonctions manquantes (à adapter selon l'implémentation réelle)
async function openCart() {
  showNotification("Fonctionnalité du panier en développement", "info")
}

async function loadAnnouncements() {
  showFeedback('Chargement des annonces...', 'info');
  // Afficher un skeleton dans le container des annonces
  const container = document.getElementById('announcementsContainer');
  if (container) {
    container.innerHTML = Array(4).fill(`<div class='bg-white rounded-lg shadow-md p-6 animate-pulse h-40 mb-4'></div>`).join('');
  }
}

async function loadFullDashboard() {
  showFeedback('Chargement complet du tableau de bord...', 'info');
}

async function loadHistory() {
  showFeedback("Chargement de l'historique...", 'info');
  // Afficher un skeleton dans le container historique si présent
  const body = document.getElementById('historique-body');
  if (body) {
    body.innerHTML = Array(5).fill(`<tr><td class='px-4 md:px-6 py-4'><div class='h-4 w-20 bg-gray-200 rounded animate-pulse'></div></td><td class='px-4 md:px-6 py-4'><div class='h-4 w-24 bg-gray-200 rounded animate-pulse'></div></td><td class='px-4 md:px-6 py-4'><div class='h-4 w-40 bg-gray-200 rounded animate-pulse'></div></td></tr>`).join('');
  }
}

async function loadSubscriptions() {
  showFeedback('Chargement des abonnements...', 'info');
  // Afficher un skeleton dans le container abonnements
  const container = document.getElementById('abonnements-list');
  if (container) {
    container.innerHTML = Array(2).fill(`<div class='bg-white p-6 rounded-xl animate-pulse h-40'></div>`).join('');
  }
}

// Fonction pour gérer l'état de connexion dans l'interface
function updateAuthUI() {
    const isAuthenticated = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUser();
    
    // Mettre à jour les éléments de navigation
    const authLinks = document.querySelectorAll('[data-auth-required]');
    const guestLinks = document.querySelectorAll('[data-guest-only]');
    const userNameElements = document.querySelectorAll('[data-user-name]');

    authLinks.forEach(link => {
        link.style.display = isAuthenticated ? '' : 'none';
    });

    guestLinks.forEach(link => {
        link.style.display = isAuthenticated ? 'none' : '';
    });

    if (currentUser && userNameElements) {
        userNameElements.forEach(element => {
            element.textContent = `${currentUser.prenom} ${currentUser.nom}`;
        });
    }
}

// Fonction pour gérer la déconnexion
function handleLogout() {
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AuthService.logout();
            window.location.href = 'login.html';
        });
    }
}

// Fonction pour charger les notifications
async function loadNotifications() {
    if (!AuthService.isAuthenticated()) return;

    try {
        const currentUser = AuthService.getCurrentUser();
        const notifications = await ApiService.get(`/notifications/user/${currentUser.id}`);
        
        // Mettre à jour le compteur de notifications
        const notifCount = document.querySelector('#notificationCount');
        if (notifCount) {
            notifCount.textContent = notifications.length;
            notifCount.style.display = notifications.length > 0 ? 'block' : 'none';
        }

        // Mettre à jour la liste des notifications
        const notifList = document.querySelector('#notificationList');
        if (notifList) {
            notifList.innerHTML = notifications.map(notif => `
                <div class="notification-item p-3 border-b hover:bg-gray-50">
                    <p class="text-sm text-gray-800">${notif.message}</p>
                    <small class="text-gray-500">${new Date(notif.dateCreation).toLocaleString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
    }
}

// Fonction pour initialiser le menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('#mobileMenuBtn');
    const mobileMenu = document.querySelector('#mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Fonction pour initialiser le menu utilisateur
function initUserMenu() {
    const userMenuBtn = document.querySelector('#userMenuBtn');
    const userMenu = document.querySelector('#userMenu');

    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });

        // Fermer le menu lors d'un clic à l'extérieur
        document.addEventListener('click', (e) => {
            if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }
}

// Initialisation générale
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification sur les pages protégées
    requireAuth();

    // Initialiser l'interface utilisateur
    updateAuthUI();
    handleLogout();
    initMobileMenu();
    initUserMenu();

    // Charger les notifications si l'utilisateur est connecté
    if (AuthService.isAuthenticated()) {
        loadNotifications();
        
        // Rafraîchir les notifications toutes les minutes
        setInterval(loadNotifications, 60000);
    }
});

function showFeedback(message, type = 'info') {
  const feedback = document.getElementById('feedback-message');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-center font-medium shadow-lg ${
    type === 'success' ? 'bg-green-500 text-white' : type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
  }`;
  feedback.style.display = 'block';
  feedback.style.opacity = '1';
  setTimeout(() => {
    feedback.style.opacity = '0';
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 300);
  }, 2200);
}
