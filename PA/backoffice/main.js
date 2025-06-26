// Configuration de l'API
const API_BASE_URL = 'http://api:4000/api'; // Remplacez par votre URL d'API

// Variables globales
let currentPage = 1;
let itemsPerPage = 10;

// Fonctions utilitaires communes
function getStatutColor(statut) {
    switch(statut) {
        case 'en attente':
            return 'bg-yellow-100 text-yellow-800';
        case 'en cours':
            return 'bg-blue-100 text-blue-800';
        case 'livree':
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'terminee':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

function formatDateOnly(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function showNotification(message, type = 'info') {
    // Créer une notification toast
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonctions API communes
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Chargement des données communes
async function loadUtilisateurs() {
    try {
        return await apiRequest('/utilisateurs');
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return [];
    }
}

async function loadLivreurs() {
    try {
        return await apiRequest('/livreurs');
    } catch (error) {
        console.error('Erreur lors du chargement des livreurs:', error);
        return [];
    }
}

async function loadEntrepots() {
    try {
        return await apiRequest('/entrepots');
    } catch (error) {
        console.error('Erreur lors du chargement des entrepôts:', error);
        return [];
    }
}

// Fonctions de pagination communes
function updatePagination(total, page, elementPrefix) {
    const showingFrom = ((page - 1) * itemsPerPage) + 1;
    const showingTo = Math.min(page * itemsPerPage, total);
    
    document.getElementById(`${elementPrefix}${elementPrefix ? '-' : ''}showing-from`).textContent = showingFrom;
    document.getElementById(`${elementPrefix}${elementPrefix ? '-' : ''}showing-to`).textContent = showingTo;
    document.getElementById(`${elementPrefix}${elementPrefix ? '-' : ''}total-items`).textContent = total;
}

// Validation des formulaires
function validateForm(formId) {
    const form = document.getElementById(formId);
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });

    return isValid;
}

// Formatage des données pour les selects
function populateSelect(selectId, data, valueField, textField, placeholder = 'Sélectionner...') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = `<option value="">${placeholder}</option>`;
    
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = typeof textField === 'function' ? textField(item) : item[textField];
        select.appendChild(option);
    });
}

// Gestion des erreurs globales
window.addEventListener('unhandledrejection', function(event) {
    console.error('Erreur non gérée:', event.reason);
    showNotification('Une erreur inattendue s\'est produite', 'error');
});

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques dashboard
  try {
    const [users, annonces, livraisons, boxes, logs] = await Promise.all([
      fetch('/api/utilisateurs').then(r => r.json()),
      fetch('/api/annonces').then(r => r.json()),
      fetch('/api/livraisons').then(r => r.json()),
      fetch('/api/boxes').then(r => r.json()),
      fetch('/api/logs').then(r => r.json()),
    ]);
    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-annonces').textContent = annonces.length;
    document.getElementById('stat-livraisons').textContent = livraisons.length;
    document.getElementById('stat-boxes').textContent = boxes.length;
    document.getElementById('stat-logs').textContent = logs.length;
  } catch (e) {
    // En cas d'erreur, on laisse les stats à '-'
  }
});