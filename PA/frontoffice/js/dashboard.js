import { Chart } from "@/components/ui/chart"
// Gestion du dashboard
let dashboardData = {}
const charts = {}

// Configuration des vues par rôle
const roleViews = {
  client: {
    title: 'Dashboard Client',
    stats: ['total-announcements', 'successful-deliveries', 'total-savings', 'eco-points-total'],
    sections: ['recent-activity', 'favorite-providers', 'goals'],
    charts: ['announcements-chart', 'types-chart']
  },
  prestataire: {
    title: 'Dashboard Prestataire',
    stats: ['total-services', 'completed-services', 'revenue', 'rating'],
    sections: ['pending-services', 'service-history', 'reviews'],
    charts: ['services-chart', 'revenue-chart']
  },
  commercant: {
    title: 'Dashboard Commerçant',
    stats: ['total-orders', 'completed-orders', 'revenue', 'active-products'],
    sections: ['pending-orders', 'order-history', 'inventory'],
    charts: ['orders-chart', 'sales-chart']
  },
  livreur: {
    title: 'Dashboard Livreur',
    stats: ['total-deliveries', 'completed-deliveries', 'earnings', 'rating'],
    sections: ['pending-deliveries', 'delivery-history', 'performance'],
    charts: ['deliveries-chart', 'earnings-chart']
  }
};

// Configuration des sections par rôle
const sectionConfig = {
  client: {
    main: {
      title: 'Activité Récente',
      emptyMessage: 'Aucune activité récente',
      renderItem: (item) => `
        <div class="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 ${getActivityColor(item.type)} rounded-full flex items-center justify-center">
            <i class="${getActivityIcon(item.type)} text-white"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">${item.title}</p>
            <p class="text-sm text-gray-600">${item.description}</p>
            <p class="text-xs text-gray-500">${formatDate(item.date)}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-medium ${getStatusColor(item.status)}">${item.status}</span>
          </div>
        </div>
      `
    },
    secondary: [
      {
        title: 'Taux de Réussite',
        render: (data) => `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h4 class="font-bold text-gray-900 mb-4">Taux de Réussite</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Livraisons</span>
                  <span>${data.deliveryRate}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-success to-emerald-400 h-2 rounded-full" style="width: ${data.deliveryRate}%"></div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: 'Objectifs',
        render: (data) => `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h4 class="font-bold text-gray-900 mb-4">Objectifs du Mois</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Points éco</span>
                  <span>${data.currentPoints}/${data.targetPoints}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-gradient-to-r from-accent to-cyan-400 h-2 rounded-full" style="width: ${(data.currentPoints/data.targetPoints)*100}%"></div>
                </div>
              </div>
            </div>
      </div>
    `
      }
    ]
  },
  prestataire: {
    main: {
      title: 'Services en Cours',
      emptyMessage: 'Aucun service en cours',
      renderItem: (item) => `
    <div class="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <i class="fas fa-briefcase text-white"></i>
      </div>
      <div class="flex-1">
            <p class="font-medium text-gray-900">${item.serviceName}</p>
            <p class="text-sm text-gray-600">Client: ${item.clientName}</p>
            <p class="text-xs text-gray-500">${formatDate(item.date)}</p>
      </div>
      <div class="text-right">
            <span class="text-sm font-medium ${getStatusColor(item.status)}">${item.status}</span>
          </div>
        </div>
      `
    },
    secondary: [
      {
        title: 'Performance',
        render: (data) => `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h4 class="font-bold text-gray-900 mb-4">Performance</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Note moyenne</span>
                <div class="flex items-center">
                  ${createStarRating(data.rating)}
                  <span class="ml-2 text-sm font-medium">${data.rating}/5</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Taux de satisfaction</span>
                <span class="text-sm font-medium text-success">${data.satisfactionRate}%</span>
              </div>
      </div>
    </div>
  `
}
    ]
  },
  commercant: {
    main: {
      title: 'Commandes Récentes',
      emptyMessage: 'Aucune commande récente',
      renderItem: (item) => `
        <div class="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 bg-gradient-to-r from-warning to-orange-400 rounded-full flex items-center justify-center">
            <i class="fas fa-shopping-bag text-white"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">Commande #${item.orderId}</p>
            <p class="text-sm text-gray-600">${item.items} articles - ${formatPrice(item.total)}</p>
            <p class="text-xs text-gray-500">${formatDate(item.date)}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-medium ${getStatusColor(item.status)}">${item.status}</span>
          </div>
      </div>
    `
    },
    secondary: [
      {
        title: 'Stock',
        render: (data) => `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h4 class="font-bold text-gray-900 mb-4">État du Stock</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Produits en stock</span>
                <span class="text-sm font-medium">${data.inStock}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Produits en rupture</span>
                <span class="text-sm font-medium text-danger">${data.outOfStock}</span>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  livreur: {
    main: {
      title: 'Livraisons en Cours',
      emptyMessage: 'Aucune livraison en cours',
      renderItem: (item) => `
        <div class="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <i class="fas fa-truck text-white"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">Livraison #${item.deliveryId}</p>
            <p class="text-sm text-gray-600">${item.address}</p>
            <p class="text-xs text-gray-500">${formatDate(item.date)}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-medium ${getStatusColor(item.status)}">${item.status}</span>
          </div>
        </div>
      `
    },
    secondary: [
      {
        title: 'Performance',
        render: (data) => `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h4 class="font-bold text-gray-900 mb-4">Performance</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Délai moyen</span>
                <span class="text-sm font-medium">${data.averageDeliveryTime} min</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Note moyenne</span>
                <div class="flex items-center">
                  ${createStarRating(data.rating)}
                  <span class="ml-2 text-sm font-medium">${data.rating}/5</span>
                </div>
              </div>
            </div>
      </div>
        `
      }
    ]
  }
};

// Initialisation du dashboard
document.addEventListener("DOMContentLoaded", async () => {
  // Vérifier l'authentification
  if (!AuthService.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    // Récupérer l'utilisateur courant et son rôle
    const currentUser = AuthService.getCurrentUser();
    const currentRole = localStorage.getItem('currentRole') || 'client';

    // Vérifier si l'utilisateur a accès à ce rôle
    const hasAccess = await RoleService.hasRole(currentUser.id, currentRole);
    if (!hasAccess) {
      window.location.href = 'role.html';
      return;
    }

    // Charger les données spécifiques au rôle
    const roleData = await RoleService.getRoleData(currentRole, currentUser.id);
    
    // Mettre à jour l'interface utilisateur
    renderDashboardUI(currentRole, roleData);
    
    // Initialiser les graphiques
    initializeCharts(currentRole);
    
    // Mettre à jour les sections
    updateSections(currentRole, roleData);

  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error);
    showNotification('Une erreur est survenue lors du chargement du dashboard.', 'error');
  }
});

// === NOTIFICATIONS ===

document.addEventListener('DOMContentLoaded', () => {
    // Gestion ouverture/fermeture panneau
    const notifBtn = document.getElementById('notifications-btn');
    const notifPanel = document.getElementById('notifications-panel');
    document.addEventListener('click', (e) => {
        if (notifPanel && !notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
            notifPanel.classList.add('hidden');
        }
    });
    notifBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('hidden');
        if (!notifPanel.classList.contains('hidden')) {
            loadNotifications();
        }
    });

    // Marquer toutes comme lues
    document.getElementById('mark-all-read')?.addEventListener('click', async () => {
        await markAllNotificationsRead();
        loadNotifications();
    });
});

async function loadNotifications() {
    const notifList = document.getElementById('notifications-list');
    const notifEmpty = document.getElementById('notifications-empty');
    const notifCount = document.getElementById('notifications-count');
    notifList.innerHTML = '';
    notifEmpty.classList.add('hidden');
    notifCount.classList.add('hidden');

    try {
        const token = localStorage.getItem('token');
        const user = AuthService.getCurrentUser();
        if (!user || !token) return;
        const res = await fetch(`/api/notifications/user/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erreur API');
        const notifications = await res.json();
        if (!notifications.length) {
            notifEmpty.classList.remove('hidden');
            return;
        }
        let unreadCount = 0;
        notifications.forEach(n => {
            if (!n.lu) unreadCount++;
            notifList.innerHTML += renderNotificationItem(n);
        });
        if (unreadCount > 0) {
            notifCount.textContent = unreadCount;
            notifCount.classList.remove('hidden');
        }
        // Actions sur chaque notif
        notifList.querySelectorAll('.notif-mark-read').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.dataset.id;
                await markNotificationRead(id);
                loadNotifications();
            });
        });
        notifList.querySelectorAll('.notif-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.dataset.id;
                await deleteNotification(id);
                loadNotifications();
            });
        });
    } catch (err) {
        notifEmpty.textContent = 'Erreur lors du chargement des notifications';
        notifEmpty.classList.remove('hidden');
    }
}

function renderNotificationItem(n) {
    return `<div class="flex items-start px-4 py-3 hover:bg-gray-50 group">
        <div class="flex-1">
            <p class="font-medium text-gray-900">${n.titre || 'Notification'}</p>
            <p class="text-gray-600 text-sm">${n.message || ''}</p>
            <p class="text-xs text-gray-400 mt-1">${formatDate(n.date)}</p>
        </div>
        <div class="flex flex-col items-end ml-4 space-y-2">
            ${!n.lu ? `<button class="notif-mark-read text-xs text-primary hover:underline" data-id="${n.id}">Marquer comme lue</button>` : ''}
            <button class="notif-delete text-xs text-danger hover:underline" data-id="${n.id}">Supprimer</button>
        </div>
    </div>`;
}

async function markNotificationRead(id) {
    const token = localStorage.getItem('token');
    await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

async function deleteNotification(id) {
    const token = localStorage.getItem('token');
    await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

async function markAllNotificationsRead() {
    const token = localStorage.getItem('token');
    const user = AuthService.getCurrentUser();
    await fetch(`/api/notifications/user/${user.id}/readAll`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

// Fonctions utilitaires
function getActivityIcon(type) {
  const icons = {
    delivery: 'fas fa-truck',
    order: 'fas fa-shopping-bag',
    service: 'fas fa-briefcase',
    payment: 'fas fa-credit-card',
    review: 'fas fa-star'
  };
  return icons[type] || 'fas fa-info-circle';
}

function getActivityColor(type) {
  const colors = {
    delivery: 'bg-gradient-to-r from-primary to-secondary',
    order: 'bg-gradient-to-r from-warning to-orange-400',
    service: 'bg-gradient-to-r from-success to-emerald-400',
    payment: 'bg-gradient-to-r from-info to-cyan-400',
    review: 'bg-gradient-to-r from-accent to-purple-400'
  };
  return colors[type] || 'bg-gradient-to-r from-gray-400 to-gray-500';
}

function getStatusColor(status) {
  const colors = {
    pending: 'text-warning',
    completed: 'text-success',
    cancelled: 'text-danger',
    inProgress: 'text-info',
    delivered: 'text-success',
    processing: 'text-info'
  };
  return colors[status] || 'text-gray-600';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function createStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return `
    ${Array(fullStars).fill('<i class="fas fa-star text-warning"></i>').join('')}
    ${hasHalfStar ? '<i class="fas fa-star-half-alt text-warning"></i>' : ''}
    ${Array(emptyStars).fill('<i class="far fa-star text-warning"></i>').join('')}
  `;
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
  // Supprimer les notifications existantes
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  // Créer la nouvelle notification
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 p-4 rounded-lg ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white max-w-md shadow-lg z-50 transform transition-all duration-300 ease-in-out`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animation d'entrée
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Fonction pour initialiser les graphiques
function initializeCharts(role) {
  const chartConfig = {
    client: {
      'announcements-chart': {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Annonces',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      },
      'types-chart': {
        type: 'doughnut',
        data: {
          labels: ['Livraisons', 'Services', 'Achats'],
          datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ]
          }]
        }
      }
    },
    // Ajouter les configurations pour les autres rôles...
  };

  const roleCharts = chartConfig[role] || {};
  Object.entries(roleCharts).forEach(([chartId, config]) => {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (ctx) {
      new Chart(ctx, config);
    }
  });
}

// Fonction pour mettre à jour l'interface utilisateur du dashboard
function renderDashboardUI(role, userData) {
  const view = roleViews[role];
  if (!view) return;

  // Mettre à jour le titre
  document.querySelector('#dashboard-title').textContent = view.title;

  // Mettre à jour les statistiques
  const statsContainer = document.querySelector('#stats-container');
  if (statsContainer && userData.stats) {
    statsContainer.innerHTML = '';
    view.stats.forEach(statKey => {
      const stat = userData.stats[statKey];
      if (stat) {
        statsContainer.innerHTML += `
          <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
            <h3 class="text-lg font-semibold text-gray-900">${stat.label}</h3>
            <p class="text-3xl font-bold mt-2">${stat.value}</p>
            <p class="text-sm text-gray-600 mt-1">${stat.description}</p>
          </div>
        `;
      }
    });
  }

  // Mettre à jour la section principale
  const mainSection = document.querySelector('#main-section');
  if (mainSection) {
    const config = sectionConfig[role].main;
    mainSection.innerHTML = `
      <h2 class="text-xl font-bold mb-4">${config.title}</h2>
      <div class="space-y-4">
        ${userData[config.dataKey]?.length ? 
          userData[config.dataKey].map(item => config.renderItem(item)).join('') :
          `<p class="text-gray-500 text-center py-8">${config.emptyMessage}</p>`
        }
      </div>
    `;
  }

  // Mettre à jour les sections secondaires
  const secondaryContainer = document.querySelector('#secondary-sections');
  if (secondaryContainer) {
    secondaryContainer.innerHTML = '';
    sectionConfig[role].secondary.forEach(section => {
      if (userData[section.dataKey]) {
        secondaryContainer.innerHTML += section.render(userData[section.dataKey]);
      }
    });
  }
}

// Fonction pour mettre à jour les sections
function updateSections(role, data) {
  const config = sectionConfig[role];
  if (!config) return;

  // Mettre à jour la section principale
  const mainSection = document.querySelector('#main-section');
  if (mainSection && data.main) {
    mainSection.innerHTML = config.main.renderItem(data.main);
  }

  // Mettre à jour les sections secondaires
  const secondaryContainer = document.querySelector('#secondary-sections');
  if (secondaryContainer && data.secondary) {
    secondaryContainer.innerHTML = '';
    config.secondary.forEach((section, index) => {
      if (data.secondary[index]) {
        secondaryContainer.innerHTML += section.render(data.secondary[index]);
      }
    });
  }
}
