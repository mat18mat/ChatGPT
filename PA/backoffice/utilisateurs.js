// Gestion des utilisateurs admin
let usersCurrentPage = 1;
const usersPerPage = 10;
let usersTotal = 0;
let usersCache = [];

// Vérification de l'authentification admin
if (!localStorage.getItem('adminToken')) {
  window.location.href = 'login.html';
}

const API_URL = '/api/utilisateurs'; // À adapter selon ton backend
const usersList = document.getElementById('users-list');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const refreshBtn = document.getElementById('refresh');
const modal = document.getElementById('user-modal');
const modalBody = document.getElementById('user-modal-body');
const closeModal = document.getElementById('close-user-modal');

let users = [];
let filteredUsers = [];

// Initialisation
function initUsers() {
  loadUsers();
  document.getElementById('search-user').addEventListener('input', debounce(loadUsers, 300));
  document.getElementById('filter-role').addEventListener('change', loadUsers);
  document.getElementById('filter-status').addEventListener('change', loadUsers);
}

// Chargement des utilisateurs
async function loadUsers() {
  showSkeleton(true);
  showFeedback('Chargement des utilisateurs...', 'info');
  try {
    const search = document.getElementById('search-user').value;
    const role = document.getElementById('filter-role').value;
    const status = document.getElementById('filter-status').value;
    const params = new URLSearchParams({
      page: usersCurrentPage,
      limit: usersPerPage,
      search,
      role,
      status
    });
    const res = await fetch(`/api/utilisateurs?${params}`);
    if (!res.ok) throw new Error('Erreur API');
    const data = await res.json();
    usersCache = data.users || data;
    usersTotal = data.total || usersCache.length;
    displayUsers(usersCache);
    updatePagination(usersTotal, usersCurrentPage);
    showSkeleton(false);
    showFeedback('Utilisateurs chargés', 'success');
    // Charger les rôles pour le filtre si besoin
    if (data.roles) populateRolesFilter(data.roles);
  } catch (e) {
    showSkeleton(false);
    showFeedback('Erreur lors du chargement des utilisateurs', 'error');
  }
}

function displayUsers(users) {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-400 py-8">Aucun utilisateur trouvé</td></tr>';
    return;
  }
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 text-sm text-gray-900">${user.id || user.IdUtilisateur}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${user.nom || user.Nom} ${user.prenom || user.Prenom || ''}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${user.email || user.Email}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${user.role || user.Role || '-'}</td>
      <td class="px-6 py-4 text-sm">
        <span class="px-2 py-1 rounded-full text-xs ${user.statut === 'banni' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
          ${user.statut === 'banni' ? 'Banni' : 'Actif'}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-900">${formatDate(user.dateInscription || user.createdAt)}</td>
      <td class="px-6 py-4 text-sm font-medium">
        <button onclick="viewUserDetails('${user.id || user.IdUtilisateur}')" class="text-primary hover:text-blue-900 mr-2">Détail</button>
        <button onclick="toggleBanUser('${user.id || user.IdUtilisateur}', '${user.statut}')" class="text-danger hover:text-red-700 mr-2">${user.statut === 'banni' ? 'Réactiver' : 'Bannir'}</button>
        <button onclick="deleteUser('${user.id || user.IdUtilisateur}')" class="text-gray-400 hover:text-red-600">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Voir/modifier un utilisateur
async function viewUserDetails(userId) {
  try {
    const res = await fetch(`/api/utilisateurs/${userId}`);
    if (!res.ok) throw new Error('Erreur API');
    const user = await res.json();
    document.getElementById('user-details-content').innerHTML = `
      <div class="space-y-4">
        <div><strong>ID:</strong> ${user.id || user.IdUtilisateur}</div>
        <div><strong>Nom:</strong> ${user.nom || user.Nom} ${user.prenom || user.Prenom || ''}</div>
        <div><strong>Email:</strong> ${user.email || user.Email}</div>
        <div><strong>Rôle:</strong> ${user.role || user.Role}</div>
        <div><strong>Statut:</strong> <span class="px-2 py-1 rounded-full text-xs ${user.statut === 'banni' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">${user.statut === 'banni' ? 'Banni' : 'Actif'}</span></div>
        <div><strong>Date d'inscription:</strong> ${formatDate(user.dateInscription || user.createdAt)}</div>
        <div><strong>Adresse:</strong> ${user.adresse || user.Adresse || '-'}</div>
        <div><strong>Téléphone:</strong> ${user.telephone || user.Telephone || '-'}</div>
      </div>
    `;
    showModal('modal-user-details');
  } catch (e) {
    showFeedback('Erreur lors du chargement du détail utilisateur', 'error');
  }
}

// Bannir/réactiver
async function toggleBanUser(userId, statut) {
  if (!confirm(statut === 'banni' ? 'Réactiver cet utilisateur ?' : 'Bannir cet utilisateur ?')) return;
  try {
    const res = await fetch(`/api/utilisateurs/${userId}/ban`, { method: 'POST' });
    if (!res.ok) throw new Error('Erreur API');
    showFeedback(statut === 'banni' ? 'Utilisateur réactivé' : 'Utilisateur banni', 'success');
    loadUsers();
  } catch (e) {
    showFeedback('Erreur lors du changement de statut', 'error');
  }
}

// Supprimer
async function deleteUser(userId) {
  if (!confirm('Supprimer définitivement cet utilisateur ?')) return;
  showLoader();
  try {
    const res = await fetch(`/api/utilisateurs/${userId}`, { method: 'DELETE' });
    hideLoader();
    if (!res.ok) throw new Error('Erreur API');
    showToast('Utilisateur supprimé', 'success');
    loadUsers();
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression', 'error');
  }
}

// Pagination
function previousPageUsers() {
  if (usersCurrentPage > 1) {
    usersCurrentPage--;
    loadUsers();
  }
}
function nextPageUsers() {
  if (usersCurrentPage * usersPerPage < usersTotal) {
    usersCurrentPage++;
    loadUsers();
  }
}
function updatePagination(total, page) {
  const from = (page - 1) * usersPerPage + 1;
  const to = Math.min(page * usersPerPage, total);
  document.getElementById('users-showing-from').textContent = from;
  document.getElementById('users-showing-to').textContent = to;
  document.getElementById('users-total-items').textContent = total;
}

// Feedback global
function showFeedback(message, type = 'info') {
  const el = document.getElementById('feedback-message');
  el.textContent = message;
  el.className = `mb-4 text-center ${type === 'error' ? 'text-danger bg-danger/10' : 'text-success bg-success/10'} py-2 rounded-xl`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2500);
}

// Skeleton
function showSkeleton(show) {
  document.getElementById('users-skeleton').style.display = show ? '' : 'none';
}

// Modal
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Débounce
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Format date
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Peupler le filtre des rôles
function populateRolesFilter(roles) {
  const select = document.getElementById('filter-role');
  select.innerHTML = '<option value="">Tous les rôles</option>' + roles.map(r => `<option value="${r}">${r}</option>`).join('');
}

// Initialisation auto si la page est chargée seule
if (document.getElementById('users-tbody')) {
  initUsers();
}

function showSkeletons() {
  usersList.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    usersList.innerHTML += `<tr><td colspan="7"><div class="animate-pulse h-6 bg-gray-200 rounded w-full my-2"></div></td></tr>`;
  }
}

function renderUsers(list) {
  if (!list.length) {
    usersList.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">Aucun utilisateur trouvé.</td></tr>';
    return;
  }
  usersList.innerHTML = list.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.nom || '-'} ${u.prenom || ''}</td>
      <td>${u.email}</td>
      <td>${u.role || '-'}</td>
      <td><span class="badge ${u.statut === 'banni' ? 'banni' : 'actif'}">${u.statut === 'banni' ? 'Banni' : 'Actif'}</span></td>
      <td>${u.date_creation ? new Date(u.date_creation).toLocaleDateString() : '-'}</td>
      <td class="actions-btn">
        <button class="btn" onclick="showUserDetails(${u.id})"><i class="fas fa-eye"></i></button>
        ${u.statut === 'banni' ?
          `<button class="btn" onclick="reactivateUser(${u.id})"><i class="fas fa-user-check"></i></button>` :
          `<button class="btn" onclick="banUser(${u.id})"><i class="fas fa-user-slash"></i></button>`}
        <button class="btn" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

async function fetchUsers() {
  showSkeletons();
  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    const data = await res.json();
    users = data;
    applyFilters();
  } catch (e) {
    usersList.innerHTML = '<tr><td colspan="7" class="text-center text-red-500">Erreur de chargement.</td></tr>';
  }
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  filteredUsers = users.filter(u => {
    const matchQ = (u.nom || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchStatus = !status || (status === 'banni' ? u.statut === 'banni' : u.statut !== 'banni');
    return matchQ && matchStatus;
  });
  renderUsers(filteredUsers);
}

window.showUserDetails = function(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  modalBody.innerHTML = `
    <div class="modal-header">Détails utilisateur #${user.id}</div>
    <div><b>Nom :</b> ${user.nom || '-'} ${user.prenom || ''}</div>
    <div><b>Email :</b> ${user.email}</div>
    <div><b>Rôle :</b> ${user.role || '-'}</div>
    <div><b>Statut :</b> <span class="badge ${user.statut === 'banni' ? 'banni' : 'actif'}">${user.statut === 'banni' ? 'Banni' : 'Actif'}</span></div>
    <div><b>Date création :</b> ${user.date_creation ? new Date(user.date_creation).toLocaleString() : '-'}</div>
    <div class="mt-4 flex gap-2">
      ${user.statut === 'banni' ?
        `<button class="btn" onclick="reactivateUser(${user.id})"><i class='fas fa-user-check'></i> Réactiver</button>` :
        `<button class="btn" onclick="banUser(${user.id})"><i class='fas fa-user-slash'></i> Bannir</button>`}
      <button class="btn" onclick="deleteUser(${user.id})"><i class='fas fa-trash'></i> Supprimer</button>
    </div>
  `;
  modal.style.display = 'flex';
}

window.banUser = async function(id) {
  if (!confirm('Bannir cet utilisateur ?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}/ban`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    if (!res.ok) throw new Error('Erreur lors du bannissement');
    users = users.map(u => u.id === id ? { ...u, statut: 'banni' } : u);
    applyFilters();
    modal.style.display = 'none';
    alert('Utilisateur banni avec succès.');
  } catch (e) {
    alert('Erreur lors du bannissement.');
  }
}

window.reactivateUser = async function(id) {
  if (!confirm('Réactiver cet utilisateur ?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}/reactivate`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    if (!res.ok) throw new Error('Erreur lors de la réactivation');
    users = users.map(u => u.id === id ? { ...u, statut: 'actif' } : u);
    applyFilters();
    modal.style.display = 'none';
    alert('Utilisateur réactivé avec succès.');
  } catch (e) {
    alert('Erreur lors de la réactivation.');
  }
}

window.deleteUser = async function(id) {
  if (!confirm('Supprimer cet utilisateur ?')) return;
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    hideLoader();
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    users = users.filter(u => u.id !== id);
    applyFilters();
    modal.style.display = 'none';
    showToast('Utilisateur supprimé avec succès.', 'success');
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression.', 'error');
  }
}

closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
refreshBtn.addEventListener('click', fetchUsers);

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques utilisateurs
  try {
    const users = await fetch('/api/utilisateurs').then(r => r.json());
    document.getElementById('stat-users-total').textContent = users.length;
    document.getElementById('stat-users-actifs').textContent = users.filter(u => u.statut !== 'banni').length;
    document.getElementById('stat-users-bannis').textContent = users.filter(u => u.statut === 'banni').length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    document.getElementById('stat-users-nouveaux').textContent = users.filter(u => {
      const d = new Date(u.date_creation);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', fetchUsers); 