// Gestion du panier
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Initialisation du panier
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay()
})

// Declare showNotification, formatPrice, and apiCall (assuming they are defined elsewhere)
// For demonstration purposes, I'm adding empty function definitions.
// In a real application, these would be properly defined or imported.
function showNotification(message, type) {
  console.log(`Notification: ${message} (${type})`)
}

function formatPrice(price) {
  return price.toFixed(2) + " €" // Example formatting
}

async function apiCall(endpoint, options) {
  console.log(`API Call: ${endpoint}`, options)
  return { success: false, order: { id: "test" } } // Example response
}

// Ajouter un item au panier
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id && item.type === item.type)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...item,
      quantity: 1,
      addedAt: new Date().toISOString(),
    })
  }

  saveCart()
  updateCartDisplay()
  showNotification("Article ajouté au panier", "success")
}

// Supprimer un item du panier
function removeFromCart(itemId, itemType) {
  cart = cart.filter((item) => !(item.id === itemId && item.type === itemType))
  saveCart()
  updateCartDisplay()
  showNotification("Article retiré du panier", "info")
}

// Modifier la quantité d'un item
function updateCartItemQuantity(itemId, itemType, quantity) {
  const item = cart.find((cartItem) => cartItem.id === itemId && cartItem.type === itemType)

  if (item) {
    if (quantity <= 0) {
      removeFromCart(itemId, itemType)
    } else {
      item.quantity = quantity
      saveCart()
      updateCartDisplay()
    }
  }
}

// Vider le panier
function clearCart() {
  cart = []
  saveCart()
  updateCartDisplay()
  showNotification("Panier vidé", "info")
}

// Sauvegarder le panier
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
  const cartCount = document.getElementById("cart-count")
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")

  // Compter le nombre total d'articles
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (cartCount) {
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "flex" : "none"
  }

  // Afficher les items dans la modal
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Votre panier est vide</p>'
    } else {
      cartItems.innerHTML = cart.map((item) => createCartItemHTML(item)).join("")
    }
  }

  // Calculer et afficher le total
  const total = calculateCartTotal()
  if (cartTotal) {
    cartTotal.textContent = formatPrice(total)
  }
}

// Créer le HTML pour un item du panier
function createCartItemHTML(item) {
  return `
        <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex-1">
                <h4 class="font-medium">${item.title || item.name}</h4>
                <p class="text-sm text-gray-600">${formatPrice(item.price)}</p>
                ${item.type ? `<span class="text-xs bg-gray-100 px-2 py-1 rounded">${item.type}</span>` : ""}
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="updateCartItemQuantity('${item.id}', '${item.type}', ${item.quantity - 1})" 
                        class="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100">
                    <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="w-8 text-center">${item.quantity}</span>
                <button onclick="updateCartItemQuantity('${item.id}', '${item.type}', ${item.quantity + 1})" 
                        class="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100">
                    <i class="fas fa-plus text-xs"></i>
                </button>
                <button onclick="removeFromCart('${item.id}', '${item.type}')" 
                        class="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    `
}

// Calculer le total du panier
function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Ouvrir la modal du panier
function openCart() {
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.classList.remove("hidden")
    updateCartDisplay()
  }
}

// Fermer la modal du panier
function closeCart() {
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.classList.add("hidden")
  }
}

// Procéder au paiement
async function proceedToPayment() {
  if (cart.length === 0) {
    showNotification("Votre panier est vide", "warning")
    return
  }

  try {
    // Créer une commande
    const orderData = {
      items: cart,
      total: calculateCartTotal(),
      createdAt: new Date().toISOString(),
    }

    const response = await apiCall("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })

    if (response.success) {
      // Rediriger vers la page de paiement
      localStorage.setItem("pendingOrder", JSON.stringify(response.order))
      window.location.href = `paiement.html?orderId=${response.order.id}`
    }
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error)
    showNotification("Erreur lors de la création de la commande", "error")
  }
}

// Ajouter une annonce au panier (pour les services)
function addAnnouncementToCart(announcement) {
  const cartItem = {
    id: announcement.id,
    type: "announcement",
    title: announcement.title,
    price: announcement.price || 0,
    description: announcement.description,
    pickup_address: announcement.pickup_address,
    delivery_address: announcement.delivery_address,
  }

  addToCart(cartItem)
}

// Ajouter un abonnement au panier
function addSubscriptionToCart(subscription) {
  const cartItem = {
    id: subscription.id,
    type: "subscription",
    title: subscription.name,
    price: subscription.price,
    description: subscription.description,
    duration: subscription.duration,
  }

  addToCart(cartItem)
}
