// Gestion des annonces
let announcements = []
let currentPage = 1
let totalPages = 1
let filters = {}

// Déclaration des variables manquantes
const API_BASE_URL = "http://localhost:4000";


// Déclarations des fonctions manquantes (à adapter selon votre projet)
function getCurrentPage() {
  // Retourne la page actuelle (ex: en lisant l'URL)
  return window.location.pathname.split("/").pop()
}

async function apiCall(endpoint, options = {}) {
  // Simule un appel API
  const url = API_BASE_URL + endpoint
  const headers = {
    "Content-Type": "application/json",
  }

  const config = {
    ...options,
    headers,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function showNotification(message, type = 'info') {
  const feedback = document.getElementById('feedback-message');
  if (feedback) {
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
  // Fallback alert si pas de feedback-message
  else {
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR")
}

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)
}

// Initialisation
document.addEventListener("DOMContentLoaded", async () => {
  // Vérifier l'authentification
  if (!requireAuth()) return;

  const currentUser = AuthService.getCurrentUser();
  
  try {
    // Charger les annonces
    const annonces = await ApiService.get('/api/annonces');
    displayAnnouncements(annonces);

    // Initialiser les filtres
    initializeFilters();

    // Si l'utilisateur est connecté, charger ses favoris
    if (currentUser) {
      const favoris = await ApiService.get(`/annonces/favoris/${currentUser.id}`);
      updateFavorites(favoris);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des annonces:', error);
    showNotification('Erreur lors du chargement des annonces', 'error');
  }
});

// Affichage des annonces avec skeleton lors du chargement
async function loadAndDisplayAnnouncements() {
  const container = document.getElementById('announcementsContainer');
  if (container) {
    container.innerHTML = Array(4).fill(`<div class='bg-white rounded-lg shadow-md p-6 animate-pulse h-40 mb-4'></div>`).join('');
  }
  showNotification('Chargement des annonces...', 'info');
  try {
    const annonces = await ApiService.get('/api/annonces');
    displayAnnouncements(annonces);
    showNotification('Annonces chargées', 'success');
  } catch (error) {
    showNotification('Erreur lors du chargement des annonces', 'error');
  }
}

// Affichage des annonces
function displayAnnouncements(annonces) {
  const container = document.querySelector('#announcementsContainer');
  if (!container) return;
  const currentUser = AuthService.getCurrentUser();

  container.innerHTML = annonces.map(annonce => {
    let noteBtn = '';
    if (annonce.statut === 'completed' && currentUser && annonce.utilisateurId === currentUser.id) {
      noteBtn = `<button onclick="openRatingModal({
        annonceId: ${annonce.id},
        providerId: ${annonce.prestataireId || ''},
        providerName: '${annonce.prestataireNom || ''}',
        providerAvatar: '${annonce.prestataireAvatar || '/placeholder.svg'}',
        annonceTitle: '${annonce.titre.replace(/'/g, "\\'")}'
      })" class="mt-2 w-full bg-warning text-white py-2 px-4 rounded hover:bg-orange-400 transition">Noter</button>`;
    }
    let cancelBtn = '';
    if (["pending", "accepted", "in_progress"].includes(annonce.statut) && currentUser && annonce.utilisateurId === currentUser.id) {
      cancelBtn = `<button onclick="cancelAnnouncement(${annonce.id})" class="mt-2 w-full bg-danger text-white py-2 px-4 rounded hover:bg-red-600 transition">Annuler</button>`;
    }
    let invoiceBtn = '';
    if (["completed", "paid"].includes(annonce.statut) && currentUser && annonce.utilisateurId === currentUser.id) {
      invoiceBtn = `<button onclick="downloadInvoice(${annonce.id})" class="mt-2 w-full bg-success text-white py-2 px-4 rounded hover:bg-green-600 transition">Télécharger la facture</button>`;
    }
    return `
    <div class="bg-white rounded-lg shadow-md overflow-hidden relative">
      <div class="absolute top-2 right-2 z-10 flex space-x-2">
        <button onclick="editAnnouncement(${annonce.id})" class="p-2 rounded-full hover:bg-blue-50" title="Modifier">
          <i class="fas fa-edit text-blue-500"></i>
        </button>
        <button onclick="deleteAnnouncement(${annonce.id})" class="p-2 rounded-full hover:bg-red-50" title="Supprimer">
          <i class="fas fa-trash text-red-500"></i>
        </button>
      </div>
      <div class="relative pb-2/3">
        <img src="${annonce.mediaAnnonces[0]?.url || 'default-image.jpg'}" 
          alt="${annonce.titre}"
          class="absolute h-full w-full object-cover">
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">${annonce.titre}</h3>
        <p class="text-gray-600 text-sm mb-2">${annonce.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-blue-600 font-bold">${annonce.prix}€</span>
          <button onclick="toggleFavorite(${annonce.id})" 
            class="favorite-btn p-2 rounded-full hover:bg-gray-100"
            data-annonce-id="${annonce.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <button onclick="showAnnonceDetails(${annonce.id})"
          class="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Voir les détails
        </button>
        ${currentUser && annonce.utilisateurId !== currentUser.id ? `<button onclick="reserveAnnouncement(${annonce.id})" class="mt-2 w-full bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition">Réserver</button>` : ''}
        ${noteBtn}
        ${cancelBtn}
        ${invoiceBtn}
      </div>
    </div>
    `;
  }).join('');
}

// Gestion des favoris
async function toggleFavorite(annonceId) {
  if (!AuthService.isAuthenticated()) {
    showNotification('Veuillez vous connecter pour ajouter aux favoris', 'error');
    return;
  }

  const currentUser = AuthService.getCurrentUser();
  const button = document.querySelector(`[data-annonce-id="${annonceId}"]`);
  
  try {
    const isFavorite = button.querySelector('i').classList.contains('fas');
    
    if (isFavorite) {
      await ApiService.delete(`/annonces/favoris/${currentUser.id}/${annonceId}`);
      button.querySelector('i').classList.replace('fas', 'far');
    } else {
      await ApiService.post(`/annonces/favoris`, {
        utilisateurId: currentUser.id,
        annonceId: annonceId
      });
      button.querySelector('i').classList.replace('far', 'fas');
    }
    
    showNotification(
      isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      'success'
    );
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
    showNotification('Erreur lors de la modification des favoris', 'error');
  }
}

// Mise à jour des favoris
function updateFavorites(favoris) {
  favoris.forEach(favori => {
    const button = document.querySelector(`[data-annonce-id="${favori.annonceId}"]`);
    if (button) {
      button.querySelector('i').classList.replace('far', 'fas');
    }
  });
}

// Affichage des détails d'une annonce
async function showAnnonceDetails(annonceId) {
  try {
    const annonce = await ApiService.get(`/annonces/${annonceId}`);
    
    // Créer et afficher la modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold">${annonce.titre}</h2>
            <button onclick="this.closest('.fixed').remove()" 
              class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            ${annonce.mediaAnnonces.map(media => `
              <img src="${media.url}" 
                alt="Image de l'annonce"
                class="w-full h-48 object-cover rounded">
            `).join('')}
          </div>
          <p class="text-gray-700 mb-4">${annonce.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-blue-600">${annonce.prix}€</span>
            <button onclick="contactVendeur(${annonce.utilisateurId})"
              class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Contacter le vendeur
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error);
    showNotification('Erreur lors du chargement des détails', 'error');
  }
}

// Contact vendeur
async function contactVendeur(vendeurId) {
  if (!AuthService.isAuthenticated()) {
    showNotification('Veuillez vous connecter pour contacter le vendeur', 'error');
    return;
  }

  const currentUser = AuthService.getCurrentUser();
  
  try {
    // Créer ou récupérer une conversation existante
    const conversation = await ApiService.post('/conversations', {
      utilisateur1Id: currentUser.id,
      utilisateur2Id: vendeurId
    });

    // Rediriger vers la page de messagerie
    window.location.href = `messages.html?conversation=${conversation.id}`;
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    showNotification('Erreur lors de la création de la conversation', 'error');
  }
}

// Initialisation des filtres
function initializeFilters() {
  const filterForm = document.querySelector('#filterForm');
  if (!filterForm) return;

  filterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(filterForm);
    const filters = {
      categorie: formData.get('categorie'),
      prixMin: formData.get('prixMin'),
      prixMax: formData.get('prixMax'),
      tri: formData.get('tri')
    };

    try {
      const annonces = await ApiService.get('/api/annonces?' + new URLSearchParams(filters));
      displayAnnouncements(annonces);
    } catch (error) {
      console.error('Erreur lors du filtrage des annonces:', error);
      showNotification('Erreur lors du filtrage des annonces', 'error');
    }
  });
}

// --- LOGIQUE CRÉATION/ÉDITION D'ANNONCE ---

let editingAnnouncementId = null;

window.openCreateModal = function() {
    editingAnnouncementId = null;
    resetAnnouncementForm();
    document.getElementById('modal-title').textContent = 'Nouvelle annonce';
    document.getElementById('announcement-modal').classList.remove('hidden');
};

window.closeAnnouncementModal = function() {
    document.getElementById('announcement-modal').classList.add('hidden');
    resetAnnouncementForm();
};

function resetAnnouncementForm() {
    const form = document.getElementById('announcement-form');
    form.reset();
    document.getElementById('photo-preview').innerHTML = '';
    document.getElementById('photo-preview').classList.add('hidden');
}

// Pré-remplir le formulaire pour édition
window.editAnnouncement = async function(annonceId) {
    try {
        const annonce = await ApiService.get(`/annonces/${annonceId}`);
        editingAnnouncementId = annonceId;
        document.getElementById('modal-title').textContent = 'Modifier l\'annonce';
        document.getElementById('announcement-modal').classList.remove('hidden');
        // Remplir les champs
        document.querySelector('input[name="type"][value="' + annonce.type + '"]').checked = true;
        document.getElementById('title').value = annonce.titre;
        document.getElementById('category').value = annonce.categorie || '';
        document.getElementById('description').value = annonce.description;
        document.getElementById('pickup_address').value = annonce.adresseDepart;
        document.getElementById('delivery_address').value = annonce.adresseLivraison;
        document.getElementById('preferred_date').value = annonce.dateSouhaitee ? annonce.dateSouhaitee.slice(0,16) : '';
        document.getElementById('price').value = annonce.prix;
        document.getElementById('weight').value = annonce.poids;
        // Options supplémentaires
        (annonce.options || []).forEach(opt => {
            const cb = document.querySelector('input[name="options[]"][value="' + opt + '"]');
            if (cb) cb.checked = true;
        });
        // Photos (prévisualisation)
        if (annonce.mediaAnnonces && annonce.mediaAnnonces.length) {
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = annonce.mediaAnnonces.map(m => `<img src="${m.url}" class="w-20 h-20 object-cover rounded mb-2">`).join('');
            preview.classList.remove('hidden');
        }
    } catch (error) {
        showNotification('Erreur lors du chargement de l\'annonce', 'error');
    }
};

// Gestion du formulaire (création/édition)
document.getElementById('announcement-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        type: formData.get('type'),
        titre: formData.get('title'),
        categorie: formData.get('category'),
        description: formData.get('description'),
        adresseDepart: formData.get('pickup_address'),
        adresseLivraison: formData.get('delivery_address'),
        dateSouhaitee: formData.get('preferred_date'),
        prix: parseFloat(formData.get('price')) || 0,
        poids: parseFloat(formData.get('weight')) || 0,
        options: formData.getAll('options[]'),
    };
    // Gestion des photos
    const photos = formData.getAll('photos');
    let mediaUrls = [];
    if (photos && photos[0] && photos[0].size > 0) {
        // TODO: uploader les fichiers sur le serveur et récupérer les URLs
        // Ici, on simule l'upload
        mediaUrls = await Promise.all(photos.map(async file => {
            // Simuler un upload et retourner une URL
            return URL.createObjectURL(file);
        }));
    }
    data.mediaAnnonces = mediaUrls.map(url => ({ url }));

    try {
        if (editingAnnouncementId) {
            await ApiService.put(`/annonces/${editingAnnouncementId}`, data);
            showNotification('Annonce modifiée avec succès', 'success');
        } else {
            await ApiService.post('/api/annonces', data);
            showNotification('Annonce créée avec succès', 'success');
        }
        closeAnnouncementModal();
        // Rafraîchir la liste
        const annonces = await ApiService.get('/api/annonces');
        displayAnnouncements(annonces);
    } catch (error) {
        showNotification('Erreur lors de l\'enregistrement de l\'annonce', 'error');
    }
});

// Aperçu des photos
const photosInput = document.getElementById('photos');
if (photosInput) {
    photosInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const preview = document.getElementById('photo-preview');
        if (files.length) {
            preview.innerHTML = files.map(file => `<img src="${URL.createObjectURL(file)}" class="w-20 h-20 object-cover rounded mb-2">`).join('');
            preview.classList.remove('hidden');
        } else {
            preview.innerHTML = '';
            preview.classList.add('hidden');
        }
    });
}

// --- SUPPRESSION D'ANNONCE ---

window.deleteAnnouncement = async function(annonceId) {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
    try {
        await ApiService.delete(`/annonces/${annonceId}`);
        showNotification('Annonce supprimée avec succès', 'success');
        // Rafraîchir la liste
        const annonces = await ApiService.get('/api/annonces');
        displayAnnouncements(annonces);
    } catch (error) {
        showNotification('Erreur lors de la suppression de l\'annonce', 'error');
    }
};

// --- AJOUT AU PANIER / RÉSERVATION D'ANNONCE ---

window.reserveAnnouncement = async function(annonceId) {
    try {
        const annonce = await ApiService.get(`/annonces/${annonceId}`);
        // Vérifier que l'utilisateur n'est pas le propriétaire
        const currentUser = AuthService.getCurrentUser();
        if (annonce.utilisateurId === currentUser.id) {
            showNotification('Vous ne pouvez pas réserver votre propre annonce.', 'warning');
            return;
        }
        // Adapter les champs pour le panier
        const cartItem = {
            id: annonce.id,
            type: 'announcement',
            title: annonce.titre,
            price: annonce.prix || 0,
            description: annonce.description,
            pickup_address: annonce.adresseDepart,
            delivery_address: annonce.adresseLivraison,
        };
        if (typeof addAnnouncementToCart === 'function') {
            addAnnouncementToCart(cartItem);
        } else {
            // Fallback si la fonction n'est pas globale
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        showNotification('Annonce ajoutée au panier !', 'success');
        if (typeof updateCartDisplay === 'function') updateCartDisplay();
    } catch (error) {
        showNotification('Erreur lors de la réservation de l\'annonce', 'error');
    }
};

// --- NOTATION / ÉVALUATION D'ANNONCE ---

window.openRatingModal = function({ annonceId, providerId, providerName, providerAvatar, annonceTitle }) {
    // Pré-remplir les champs cachés
    document.getElementById('rating-announcement-id').value = annonceId;
    document.getElementById('rating-provider-id').value = providerId;
    document.getElementById('rating-provider-name').textContent = providerName || '';
    document.getElementById('rating-provider-avatar').src = providerAvatar || '/placeholder.svg';
    document.getElementById('rating-announcement-title').textContent = annonceTitle || '';
    // Reset étoiles et champs
    document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('text-warning'));
    document.getElementById('overall-rating').value = '';
    document.getElementById('rating-text').textContent = 'Cliquez sur les étoiles pour noter';
    document.getElementById('punctuality-rating').value = 0;
    document.getElementById('quality-rating').value = 0;
    document.getElementById('communication-rating').value = 0;
    document.getElementById('punctuality-value').textContent = '0/5';
    document.getElementById('quality-value').textContent = '0/5';
    document.getElementById('communication-value').textContent = '0/5';
    document.getElementById('rating-comment').value = '';
    document.querySelectorAll('input[name="recommend"]').forEach(r => r.checked = false);
    document.getElementById('tip-amount').value = '';
    document.getElementById('tip-amount').classList.add('hidden');
    document.getElementById('rating-modal').classList.remove('hidden');
};

window.closeRatingModal = function() {
    document.getElementById('rating-modal').classList.add('hidden');
};

// Gestion des étoiles globales
if (document.querySelectorAll('.star-btn').length) {
    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            document.getElementById('overall-rating').value = rating;
            document.getElementById('rating-text').textContent = `Note : ${rating}/5`;
            document.querySelectorAll('.star-btn').forEach((b, i) => {
                b.classList.toggle('text-warning', i < rating);
            });
        });
    });
}
// Critères détaillés
if (document.querySelectorAll('.criteria-star').length) {
    document.querySelectorAll('.criteria-star').forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            const criteria = this.dataset.criteria;
            document.getElementById(`${criteria}-rating`).value = rating;
            document.getElementById(`${criteria}-value`).textContent = `${rating}/5`;
            document.querySelectorAll(`.criteria-star[data-criteria='${criteria}']`).forEach((b, i) => {
                b.classList.toggle('text-warning', i < rating);
            });
        });
    });
}
// Pourboire
if (document.querySelectorAll('.tip-btn').length) {
    document.querySelectorAll('.tip-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tip = this.dataset.tip;
            if (tip === 'custom') {
                document.getElementById('tip-amount').classList.remove('hidden');
                document.getElementById('tip-amount').focus();
            } else {
                document.getElementById('tip-amount').value = tip;
                document.getElementById('tip-amount').classList.add('hidden');
            }
        });
    });
}
// Soumission du formulaire de notation
const ratingForm = document.getElementById('rating-form');
if (ratingForm) {
    ratingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            annonceId: document.getElementById('rating-announcement-id').value,
            providerId: document.getElementById('rating-provider-id').value,
            noteGlobale: parseInt(document.getElementById('overall-rating').value),
            ponctualite: parseInt(document.getElementById('punctuality-rating').value),
            qualite: parseInt(document.getElementById('quality-rating').value),
            communication: parseInt(document.getElementById('communication-rating').value),
            commentaire: document.getElementById('rating-comment').value,
            recommandation: document.querySelector('input[name="recommend"]:checked')?.value === 'yes',
            pourboire: parseFloat(document.getElementById('tip-amount').value) || 0
        };
        try {
            await ApiService.post('/evaluations', data);
            showNotification('Merci pour votre avis !', 'success');
            closeRatingModal();
        } catch (error) {
            showNotification('Erreur lors de la soumission de la note', 'error');
        }
    });
}

window.cancelAnnouncement = async function(annonceId) {
    if (!confirm('Voulez-vous vraiment annuler cette annonce ?')) return;
    try {
        await ApiService.post(`/annonces/${annonceId}/cancel`);
        showNotification('Annonce annulée avec succès', 'success');
        // Rafraîchir la liste
        const annonces = await ApiService.get('/api/annonces');
        displayAnnouncements(annonces);
    } catch (error) {
        showNotification('Erreur lors de l\'annulation de l\'annonce', 'error');
    }
};

window.downloadInvoice = async function(annonceId) {
    try {
        const response = await fetch(`http://localhost:3000/api/factures/annonce/${annonceId}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
            }
        });
        if (!response.ok) throw new Error('Erreur lors du téléchargement de la facture');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-annonce-${annonceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showNotification('Facture téléchargée', 'success');
    } catch (error) {
        showNotification(error.message || 'Erreur lors du téléchargement de la facture', 'error');
    }
};
