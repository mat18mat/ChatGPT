// Gestion des notifications
let notifications = []
let unreadCount = 0

// Initialisation des notifications
document.addEventListener("DOMContentLoaded", () => {
  initializeNotifications()
})

async function initializeNotifications() {
  try {
    await loadNotifications()
    initializeNotificationEvents()

    // Vérifier les nouvelles notifications toutes les 30 secondes
    setInterval(checkNewNotifications, 30000)
  } catch (error) {
    console.error("Erreur lors de l'initialisation des notifications:", error)
  }
}

// Charger les notifications
async function loadNotifications() {
  try {
    const response = await apiCall("/notifications?limit=20")
    notifications = response.data || []

    updateNotificationDisplay()
    updateNotificationBadge()
  } catch (error) {
    console.error("Erreur lors du chargement des notifications:", error)
  }
}

// Initialiser les événements
function initializeNotificationEvents() {
  const notificationBtn = document.getElementById("notifications-btn")
  const notificationDropdown = document.getElementById("notifications-dropdown")

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleNotificationDropdown()
    })

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener("click", (e) => {
      if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.add("hidden")
      }
    })
  }
}

// Basculer l'affichage du dropdown
function toggleNotificationDropdown() {
  const dropdown = document.getElementById("notifications-dropdown")
  if (dropdown) {
    dropdown.classList.toggle("hidden")

    if (!dropdown.classList.contains("hidden")) {
      // Marquer les notifications comme vues
      markNotificationsAsSeen()
    }
  }
}

// Mettre à jour l'affichage des notifications
function updateNotificationDisplay() {
  const container = document.getElementById("notifications-list")
  if (!container) return

  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-gray-500">
        <i class="fas fa-bell-slash text-4xl mb-4"></i>
        <p>Aucune notification</p>
      </div>
    `
    return
  }

  container.innerHTML = notifications
    .slice(0, 10)
    .map((notification) => createNotificationItem(notification))
    .join("")
}

// Créer un élément de notification
function createNotificationItem(notification) {
  const isUnread = !notification.readAt
  const iconClass = getNotificationIcon(notification.type)
  const colorClass = getNotificationColor(notification.type)

  return `
    <div class="notification-item p-4 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? "bg-blue-50 border-l-4 border-primary" : ""}" 
         onclick="handleNotificationClick('${notification.id}')">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0">
          <i class="${iconClass} text-white text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-900 truncate">${notification.title}</h4>
            ${isUnread ? '<div class="w-2 h-2 bg-primary rounded-full"></div>' : ""}
          </div>
          <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
          <p class="text-xs text-gray-500 mt-2">${formatTimeAgo(notification.createdAt)}</p>
        </div>
      </div>
    </div>
  `
}

// Mettre à jour le badge de notifications
function updateNotificationBadge() {
  unreadCount = notifications.filter((n) => !n.readAt).length

  const countElement = document.getElementById("notifications-count")
  const dotElement = document.getElementById("notification-dot")

  if (countElement && dotElement) {
    if (unreadCount > 0) {
      countElement.textContent = unreadCount > 99 ? "99+" : unreadCount
      countElement.classList.remove("hidden")
      dotElement.classList.remove("hidden")
    } else {
      countElement.classList.add("hidden")
      dotElement.classList.add("hidden")
    }
  }
}

// Gérer le clic sur une notification
async function handleNotificationClick(notificationId) {
  try {
    const notification = notifications.find((n) => n.id === notificationId)
    if (!notification) return

    // Marquer comme lue
    if (!notification.readAt) {
      await markNotificationAsRead(notificationId)
    }

    // Rediriger selon le type de notification
    handleNotificationAction(notification)

    // Fermer le dropdown
    document.getElementById("notifications-dropdown").classList.add("hidden")
  } catch (error) {
    console.error("Erreur lors du traitement de la notification:", error)
  }
}

// Gérer l'action de la notification
function handleNotificationAction(notification) {
  switch (notification.type) {
    case "announcement_accepted":
    case "announcement_completed":
    case "announcement_cancelled":
      window.location.href = `annonces.html?highlight=${notification.data.announcementId}`
      break
    case "new_offer":
      window.location.href = `annonces.html?offers=${notification.data.announcementId}`
      break
    case "payment_received":
    case "payment_failed":
      window.location.href = `historique.html?filter=payments`
      break
    case "rating_received":
      window.location.href = `profil.html?tab=ratings`
      break
    case "subscription_expiring":
    case "subscription_renewed":
      window.location.href = `abonnements.html`
      break
    case "box_access_shared":
    case "box_expiring":
      window.location.href = `box-stockage.html`
      break
    default:
      // Notification générale, rester sur la page actuelle
      break
  }
}

// Marquer une notification comme lue
async function markNotificationAsRead(notificationId) {
  try {
    await apiCall(`/notifications/${notificationId}/read`, {
      method: "POST",
    })

    // Mettre à jour localement
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.readAt = new Date().toISOString()
      updateNotificationDisplay()
      updateNotificationBadge()
    }
  } catch (error) {
    console.error("Erreur lors du marquage comme lu:", error)
  }
}

// Marquer toutes les notifications comme lues
async function markAllAsRead() {
  try {
    await apiCall("/notifications/mark-all-read", {
      method: "POST",
    })

    // Mettre à jour localement
    notifications.forEach((notification) => {
      if (!notification.readAt) {
        notification.readAt = new Date().toISOString()
      }
    })

    updateNotificationDisplay()
    updateNotificationBadge()
    showNotification("Toutes les notifications ont été marquées comme lues", "success")
  } catch (error) {
    console.error("Erreur lors du marquage global:", error)
    showNotification("Erreur lors du marquage des notifications", "error")
  }
}

// Marquer les notifications comme vues (pas forcément lues)
async function markNotificationsAsSeen() {
  try {
    const unseenNotifications = notifications.filter((n) => !n.seenAt)
    if (unseenNotifications.length === 0) return

    await apiCall("/notifications/mark-seen", {
      method: "POST",
      body: JSON.stringify({
        notificationIds: unseenNotifications.map((n) => n.id),
      }),
    })

    // Mettre à jour localement
    unseenNotifications.forEach((notification) => {
      notification.seenAt = new Date().toISOString()
    })
  } catch (error) {
    console.error("Erreur lors du marquage comme vues:", error)
  }
}

// Vérifier les nouvelles notifications
async function checkNewNotifications() {
  try {
    const lastCheck = localStorage.getItem("lastNotificationCheck") || new Date(0).toISOString()
    const response = await apiCall(`/notifications/new?since=${lastCheck}`)

    if (response.data && response.data.length > 0) {
      // Ajouter les nouvelles notifications
      notifications = [...response.data, ...notifications]

      // Afficher une notification toast pour les nouvelles
      response.data.forEach((notification) => {
        showNotificationToast(notification)
      })

      updateNotificationDisplay()
      updateNotificationBadge()
    }

    localStorage.setItem("lastNotificationCheck", new Date().toISOString())
  } catch (error) {
    console.error("Erreur lors de la vérification des nouvelles notifications:", error)
  }
}

// Afficher une notification toast
function showNotificationToast(notification) {
  const toast = document.createElement("div")
  toast.className =
    "fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm animate-slide-up"

  const iconClass = getNotificationIcon(notification.type)
  const colorClass = getNotificationColor(notification.type)

  toast.innerHTML = `
    <div class="flex items-start space-x-3">
      <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0">
        <i class="${iconClass} text-white text-sm"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-900">${notification.title}</h4>
        <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  document.body.appendChild(toast)

  // Supprimer automatiquement après 5 secondes
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove()
    }
  }, 5000)
}

// Utilitaires pour les notifications
function getNotificationIcon(type) {
  const icons = {
    announcement_accepted: "fas fa-check",
    announcement_completed: "fas fa-flag-checkered",
    announcement_cancelled: "fas fa-times",
    new_offer: "fas fa-hand-holding-usd",
    payment_received: "fas fa-credit-card",
    payment_failed: "fas fa-exclamation-triangle",
    rating_received: "fas fa-star",
    subscription_expiring: "fas fa-clock",
    subscription_renewed: "fas fa-crown",
    box_access_shared: "fas fa-share",
    box_expiring: "fas fa-box",
    system: "fas fa-cog",
  }
  return icons[type] || "fas fa-bell"
}

function getNotificationColor(type) {
  const colors = {
    announcement_accepted: "bg-success",
    announcement_completed: "bg-primary",
    announcement_cancelled: "bg-danger",
    new_offer: "bg-warning",
    payment_received: "bg-success",
    payment_failed: "bg-danger",
    rating_received: "bg-warning",
    subscription_expiring: "bg-warning",
    subscription_renewed: "bg-success",
    box_access_shared: "bg-accent",
    box_expiring: "bg-warning",
    system: "bg-gray-500",
  }
  return colors[type] || "bg-primary"
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return "À l'instant"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`
  } else {
    return date.toLocaleDateString("fr-FR")
  }
}

// Envoyer une notification (pour usage interne)
async function sendNotification(recipientId, type, title, message, data = {}) {
  try {
    await apiCall("/notifications", {
      method: "POST",
      body: JSON.stringify({
        recipientId,
        type,
        title,
        message,
        data,
      }),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error)
  }
}

// Fonction globale pour créer des notifications système
window.createNotification = sendNotification

// Mock functions pour éviter les erreurs
const API_BASE_URL = ""
const authToken = ""

function apiCall(endpoint, options = {}) {
  console.log(`API Call: ${endpoint}`, options)
  return Promise.resolve({ data: [] })
}

function showNotification(message, type) {
  console.log(`Notification: ${message} (${type})`)
}
