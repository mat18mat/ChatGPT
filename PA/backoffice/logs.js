// Variables spécifiques aux logs
let logsCurrentPage = 1;
const itemsPerPage = 10; // Définir itemsPerPage (ou importer si nécessaire)

// Vérification de l'authentification admin
if (!localStorage.getItem('adminToken')) {
  window.location.href = 'login.html';
}

const API_URL = '/api/logs'; // À adapter selon ton backend
const logsList = document.getElementById('logs-list');
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filter-type');
const refreshBtn = document.getElementById('refresh');
const modal = document.getElementById('log-modal');
const modalBody = document.getElementById('log-modal-body');
const closeModal = document.getElementById('close-log-modal');

let logs = [];
let filteredLogs = [];

// Initialisation de la section logs
function initLogs() {
    loadLogs();
    loadUsersForLogs();
    loadLogsStats();
    
    // Event listeners
    document.getElementById('search-action').addEventListener('input', debounce(loadLogs, 300));
    document.getElementById('filter-user').addEventListener('change', loadLogs);
    document.getElementById('date-from').addEventListener('change', loadLogs);
    document.getElementById('date-to').addEventListener('change', loadLogs);
}

// Chargement des logs
async function loadLogs() {
    showSkeletons();
    try {
        const dateFrom = document.getElementById('date-from')?.value || '';
        const dateTo = document.getElementById('date-to')?.value || '';
        const userFilter = document.getElementById('filter-user')?.value || '';
        const searchAction = document.getElementById('search-action')?.value || '';

        const params = new URLSearchParams({
            page: logsCurrentPage,
            limit: itemsPerPage,
            dateFrom: dateFrom,
            dateTo: dateTo,
            userId: userFilter,
            action: searchAction
        });

        const res = await fetch(API_URL, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
        });
        const data = await res.json();
        logs = data.logs || data;
        applyFilters();
        
        if (data.total !== undefined) {
            updatePagination(data.total, data.page || logsCurrentPage, 'logs');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des logs:', error);
        showNotification('Erreur lors du chargement des logs', 'error');
    }
}

// Affichage des logs
function displayLogs(logs) {
    const tbody = document.getElementById('logs-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    logs.forEach(log => {
        const row = document.createElement('tr');
        const actionClass = getActionClass(log.Action);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.IdLog}</td>
            <td class="px-6 py-4 text-sm text-gray-900">
                <span class="px-2 py-1 rounded-full text-xs ${actionClass}">
                    ${truncateText(log.Action, 50)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${log.utilisateur_nom ? `${log.utilisateur_nom} ${log.utilisateur_prenom || ''}` : 'Système'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${log.IP || 'N/A'}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${truncateText(log.NavigateurAppareil, 30)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(log.DateEvenement)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewLogDetails(${log.IdLog})" class="text-primary hover:text-blue-900">
                    Détails
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Voir les détails d'un log
async function viewLogDetails(id) {
    try {
        const log = await apiRequest(`/logs/${id}`);
        
        const detailsHtml = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-semibold mb-2">Informations générales</h4>
                        <p><strong>ID:</strong> ${log.IdLog}</p>
                        <p><strong>Date:</strong> ${formatDate(log.DateEvenement)}</p>
                        <p><strong>Utilisateur:</strong> ${log.utilisateur_nom ? `${log.utilisateur_nom} ${log.utilisateur_prenom || ''}` : 'Système'}</p>
                        <p><strong>Email:</strong> ${log.utilisateur_email || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-2">Informations techniques</h4>
                        <p><strong>Adresse IP:</strong> ${log.IP || 'N/A'}</p>
                        <p><strong>Navigateur:</strong> ${log.NavigateurAppareil || 'N/A'}</p>
                        <p><strong>Type d'action:</strong> <span class="px-2 py-1 rounded ${getActionClass(log.Action)}">${getActionType(log.Action)}</span></p>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Action détaillée</h4>
                    <div class="bg-gray-50 p-4 rounded border">
                        <pre class="whitespace-pre-wrap text-sm">${log.Action}</pre>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('log-details-content').innerHTML = detailsHtml;
        showModal('modal-log-details');
    } catch (error) {
        console.error('Erreur lors du chargement des détails du log:', error);
        showNotification('Erreur lors du chargement des détails', 'error');
    }
}

// Charger les statistiques des logs
async function loadLogsStats() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Logs d'aujourd'hui
        const todayLogs = await apiRequest(`/logs?dateFrom=${today}&dateTo=${today}`);
        document.getElementById('total-logs-today').textContent = todayLogs.total || todayLogs.length || 0;
        
        // Utilisateurs actifs (logs dans les dernières 24h)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const activeLogs = await apiRequest(`/logs?dateFrom=${yesterday}&groupBy=user`);
        document.getElementById('total-users-active').textContent = activeLogs.uniqueUsers || 0;
        
        // Compter les erreurs et actions critiques
        const allLogs = await apiRequest(`/logs?dateFrom=${today}&dateTo=${today}`);
        const logs = allLogs.logs || allLogs;
        
        let errorCount = 0;
        let criticalCount = 0;
        
        logs.forEach(log => {
            const action = log.Action.toLowerCase();
            if (action.includes('erreur') || action.includes('error') || action.includes('échec')) {
                errorCount++;
            }
            if (action.includes('suppression') || action.includes('delete') || action.includes('critique')) {
                criticalCount++;
            }
        });
        
        document.getElementById('total-errors').textContent = errorCount;
        document.getElementById('total-critical').textContent = criticalCount;
        
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Charger les utilisateurs pour le filtre
async function loadUsersForLogs() {
    try {
        const users = await loadUtilisateurs();
        populateSelect('filter-user', users, 'IdUtilisateur', 
            user => `${user.Nom} ${user.Prenom}`, 'Tous les utilisateurs');
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
}

// Exporter les logs
async function exportLogs() {
    try {
        const dateFrom = document.getElementById('date-from')?.value || '';
        const dateTo = document.getElementById('date-to')?.value || '';
        const userFilter = document.getElementById('filter-user')?.value || '';
        const searchAction = document.getElementById('search-action')?.value || '';

        const params = new URLSearchParams({
            dateFrom: dateFrom,
            dateTo: dateTo,
            userId: userFilter,
            action: searchAction,
            export: 'csv'
        });

        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = `${API_BASE_URL}/logs?${params}`;
        link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Export des logs lancé', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        showNotification('Erreur lors de l\'export', 'error');
    }
}

// Fonctions utilitaires pour les logs
function getActionClass(action) {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('connexion') || actionLower.includes('login')) {
        return 'bg-green-100 text-green-800';
    } else if (actionLower.includes('erreur') || actionLower.includes('error') || actionLower.includes('échec')) {
        return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('suppression') || actionLower.includes('delete')) {
        return 'bg-red-100 text-red-800';
    } else if (actionLower.includes('création') || actionLower.includes('create') || actionLower.includes('ajout')) {
        return 'bg-blue-100 text-blue-800';
    } else if (actionLower.includes('modification') || actionLower.includes('update') || actionLower.includes('edit')) {
        return 'bg-yellow-100 text-yellow-800';
    } else {
        return 'bg-gray-100 text-gray-800';
    }
}

function getActionType(action) {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('connexion') || actionLower.includes('login')) {
        return 'Connexion';
    } else if (actionLower.includes('erreur') || actionLower.includes('error')) {
        return 'Erreur';
    } else if (actionLower.includes('suppression') || actionLower.includes('delete')) {
        return 'Suppression';
    } else if (actionLower.includes('création') || actionLower.includes('create')) {
        return 'Création';
    } else if (actionLower.includes('modification') || actionLower.includes('update')) {
        return 'Modification';
    } else {
        return 'Autre';
    }
}

function truncateText(text, maxLength) {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Pagination
function previousPageLogs() {
    if (logsCurrentPage > 1) {
        logsCurrentPage--;
        loadLogs();
    }
}

function nextPageLogs() {
    logsCurrentPage++;
    loadLogs();
}

// Déclarations manquantes (à adapter selon le contexte de l'application)
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

async function apiRequest(url) {
    // Remplacer par l'implémentation réelle de l'appel API
    console.log(`Appel API simulé à : ${url}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ logs: [], total: 0 }); // Simuler une réponse vide
        }, 500);
    });
}

function updatePagination(total, page, section) {
    // Remplacer par l'implémentation réelle de la pagination
    console.log(`Pagination mise à jour pour la section ${section}, page ${page}, total ${total}`);
}

function showNotification(message, type) {
    // Remplacer par l'implémentation réelle de l'affichage des notifications
    console.log(`Notification : ${message} (type: ${type})`);
}

function showModal(modalId) {
    // Remplacer par l'implémentation réelle de l'affichage des modals
    console.log(`Affichage du modal : ${modalId}`);
}

async function loadUtilisateurs() {
    // Remplacer par l'implémentation réelle du chargement des utilisateurs
    console.log('Chargement simulé des utilisateurs');
    return [];
}

function populateSelect(selectId, users, valueField, labelFunc, allOptionLabel) {
    // Remplacer par l'implémentation réelle du remplissage du select
    console.log(`Remplissage simulé du select ${selectId}`);
}

function formatDate(dateString) {
    return dateString;
}

const API_BASE_URL = '';

function showSkeletons() {
  logsList.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    logsList.innerHTML += `<tr><td colspan="6"><div class="animate-pulse h-6 bg-gray-200 rounded w-full my-2"></div></td></tr>`;
  }
}

function renderLogs(list) {
  if (!list.length) {
    logsList.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500">Aucun log trouvé.</td></tr>';
    return;
  }
  logsList.innerHTML = list.map(l => `
    <tr>
      <td>${l.id}</td>
      <td>${l.date ? new Date(l.date).toLocaleString() : '-'}</td>
      <td><span class="badge ${l.type}">${l.type}</span></td>
      <td>${l.utilisateur?.email || '-'}</td>
      <td>${l.message || '-'}</td>
      <td class="actions-btn">
        <button class="btn" onclick="showLogDetails(${l.id})"><i class="fas fa-eye"></i></button>
      </td>
    </tr>
  `).join('');
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const type = filterType.value;
  filteredLogs = logs.filter(l => {
    const matchQ = (l.message || '').toLowerCase().includes(q) || (l.utilisateur?.email || '').toLowerCase().includes(q);
    const matchType = !type || l.type === type;
    return matchQ && matchType;
  });
  renderLogs(filteredLogs);
}

window.showLogDetails = function(id) {
  const log = logs.find(l => l.id === id);
  if (!log) return;
  modalBody.innerHTML = `
    <div class="modal-header">Détail du log #${log.id}</div>
    <div><b>Date :</b> ${log.date ? new Date(log.date).toLocaleString() : '-'}</div>
    <div><b>Type :</b> <span class="badge ${log.type}">${log.type}</span></div>
    <div><b>Utilisateur :</b> ${log.utilisateur?.email || '-'}</div>
    <div><b>Message :</b> ${log.message || '-'}</div>
    <div><b>Données :</b> <pre>${JSON.stringify(log.data, null, 2) || '-'}</pre></div>
  `;
  modal.style.display = 'flex';
}

closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', applyFilters);
filterType.addEventListener('change', applyFilters);
refreshBtn.addEventListener('click', loadLogs);

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques logs
  try {
    const logs = await fetch('/api/logs').then(r => r.json());
    document.getElementById('stat-logs-total').textContent = logs.length;
    document.getElementById('stat-logs-erreurs').textContent = logs.filter(l => l.type === 'error').length;
    document.getElementById('stat-logs-warn').textContent = logs.filter(l => l.type === 'warn').length;
    document.getElementById('stat-logs-info').textContent = logs.filter(l => l.type === 'info').length;
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', loadLogs);

window.deleteLog = async function(id) {
  if (!confirm('Supprimer ce log ?')) return;
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    hideLoader();
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    logs = logs.filter(l => l.id !== id);
    applyFilters();
    modal.style.display = 'none';
    showToast('Log supprimé avec succès.', 'success');
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression.', 'error');
  }
}