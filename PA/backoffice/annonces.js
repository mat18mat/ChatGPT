// backoffice/annonces.js

// Vérification de l'authentification admin
if (!localStorage.getItem('adminToken')) {
  window.location.href = 'login.html';
}

const API_URL = '/api/annonces'; // À adapter selon ton backend
const annoncesList = document.getElementById('annonces-list');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const refreshBtn = document.getElementById('refresh');
const modal = document.getElementById('annonce-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

let annonces = [];
let filteredAnnonces = [];

function showSkeletons() {
  annoncesList.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    annoncesList.innerHTML += `<tr><td colspan="8"><div class="animate-pulse h-6 bg-gray-200 rounded w-full my-2"></div></td></tr>`;
  }
}

function renderAnnonces(list) {
  if (!list.length) {
    annoncesList.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">Aucune annonce trouvée.</td></tr>';
    return;
  }
  annoncesList.innerHTML = list.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.titre}</td>
      <td>${a.createur?.email || '-'}</td>
      <td>${a.montant ? a.montant + ' €' : '-'}</td>
      <td><span class="badge ${a.statut}">${a.statut}</span></td>
      <td>${a.assigneA?.email || '-'}</td>
      <td>${a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
      <td class="actions-btn">
        <button class="btn" onclick="showDetails(${a.id})"><i class="fas fa-eye"></i></button>
        <button class="btn" onclick="deleteAnnonce(${a.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

async function fetchAnnonces() {
  showSkeletons();
  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    const data = await res.json();
    annonces = data;
    applyFilters();
  } catch (e) {
    annoncesList.innerHTML = '<tr><td colspan="8" class="text-center text-red-500">Erreur de chargement.</td></tr>';
  }
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  filteredAnnonces = annonces.filter(a => {
    const matchQ = a.titre.toLowerCase().includes(q) || (a.createur?.email || '').toLowerCase().includes(q);
    const matchStatus = !status || a.statut === status;
    return matchQ && matchStatus;
  });
  renderAnnonces(filteredAnnonces);
}

window.showDetails = function(id) {
  const annonce = annonces.find(a => a.id === id);
  if (!annonce) return;
  modalBody.innerHTML = `
    <div class="modal-header">Détails de l'annonce #${annonce.id}</div>
    <div><b>Titre :</b> ${annonce.titre}</div>
    <div><b>Créateur :</b> ${annonce.createur?.email || '-'}</div>
    <div><b>Montant :</b> ${annonce.montant ? annonce.montant + ' €' : '-'}</div>
    <div><b>Statut :</b> <span class="badge ${annonce.statut}">${annonce.statut}</span></div>
    <div><b>Assigné à :</b> ${annonce.assigneA?.email || '-'}</div>
    <div><b>Date :</b> ${annonce.date ? new Date(annonce.date).toLocaleString() : '-'}</div>
    <div class="mt-4 flex gap-2">
      <button class="btn" onclick="assignAnnonce(${annonce.id})"><i class="fas fa-user-plus"></i> Assigner</button>
      <button class="btn" onclick="deleteAnnonce(${annonce.id})"><i class="fas fa-trash"></i> Supprimer</button>
    </div>
  `;
  modal.style.display = 'flex';
}

window.assignAnnonce = function(id) {
  alert('Fonctionnalité d\'assignation à implémenter (sélectionner un prestataire/livreur et appeler l\'API).');
}

window.deleteAnnonce = async function(id) {
  if (!confirm('Supprimer cette annonce ?')) return;
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    hideLoader();
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    annonces = annonces.filter(a => a.id !== id);
    applyFilters();
    modal.style.display = 'none';
    showToast('Annonce supprimée avec succès.', 'success');
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression.', 'error');
  }
}

closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
refreshBtn.addEventListener('click', fetchAnnonces);

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques annonces
  try {
    const annonces = await fetch('/api/annonces').then(r => r.json());
    document.getElementById('stat-annonces-total').textContent = annonces.length;
    document.getElementById('stat-annonces-actives').textContent = annonces.filter(a => a.statut === 'active').length;
    document.getElementById('stat-annonces-assignees').textContent = annonces.filter(a => a.statut === 'assignée').length;
    document.getElementById('stat-annonces-terminees').textContent = annonces.filter(a => a.statut === 'finie').length;
    document.getElementById('stat-annonces-annulees').textContent = annonces.filter(a => a.statut === 'annulée').length;
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', fetchAnnonces); 