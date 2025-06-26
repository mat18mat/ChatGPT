if (!AuthService.isAuthenticated()) {
  window.location.href = 'login.html';
}

const currentUser = AuthService.getCurrentUser();
const token = localStorage.getItem('token');

// Affichage feedback global
function showFeedback(message, type = 'info') {
  const el = document.getElementById('feedback-message');
  el.textContent = message;
  el.className = `mb-4 text-center ${type === 'error' ? 'text-danger bg-danger/10' : 'text-success bg-success/10'} py-2 rounded-xl`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3500);
}

let historiqueCache = [];

// Ajout des filtres dynamiques
function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const date = document.getElementById('filter-date').value;
  let filtered = historiqueCache;
  if (type) {
    filtered = filtered.filter(item => item.type === type);
  }
  if (date) {
    const since = new Date(date);
    filtered = filtered.filter(item => new Date(item.date) >= since);
  }
  renderHistorique(filtered);
}

function resetFilters() {
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-date').value = '';
  renderHistorique(historiqueCache);
}

function renderHistorique(historique) {
  const body = document.getElementById('historique-body');
  if (!historique.length) {
    body.innerHTML = '<tr><td colspan="3" class="text-center text-gray-400 py-8">Aucune action trouvée</td></tr>';
    return;
  }
  body.innerHTML = historique.map(item => `
    <tr>
      <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatDate(item.date)}</td>
      <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <span class="badge-action badge-${item.type}">${item.type}</span>
      </td>
      <td class="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">${item.detail}</td>
    </tr>
  `).join('');
}

// Surcharge de loadHistorique pour stocker le cache et activer les filtres
async function loadHistorique() {
  const body = document.getElementById('historique-body');
  body.innerHTML = Array(5).fill(`<tr>
    <td class='px-4 md:px-6 py-4'><div class='h-4 w-20 bg-gray-200 rounded animate-pulse'></div></td>
    <td class='px-4 md:px-6 py-4'><div class='h-4 w-24 bg-gray-200 rounded animate-pulse'></div></td>
    <td class='px-4 md:px-6 py-4'><div class='h-4 w-40 bg-gray-200 rounded animate-pulse'></div></td>
  </tr>`).join('');
  try {
    const [livraisons, box, paiements, annonces, evaluations] = await Promise.all([
      fetch(`/api/course/user/${currentUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`/api/boxStockage/user/${currentUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`/api/paiement/user/${currentUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`/api/annonce/user/${currentUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
      fetch(`/api/evaluation/user/${currentUser.id}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.ok ? r.json() : [])
    ]);
    let historique = [];
    historique = historique.concat(
      livraisons.map(l => ({ date: l.dateLivraison || l.date, type: 'Livraison', detail: `#${l.id} - ${l.statut || ''}` })),
      box.map(b => ({ date: b.dateDebut, type: 'Box', detail: `Box #${b.id} (${b.taille}, ${b.type})` })),
      paiements.map(p => ({ date: p.date, type: 'Paiement', detail: `${p.montant} € - ${p.statut}` })),
      annonces.map(a => ({ date: a.dateCreation || a.date, type: 'Annonce', detail: a.titre || a.description || '' })),
      evaluations.map(ev => ({
        date: ev.dateEvaluation || ev.date || ev.createdAt,
        type: 'Évaluation',
        detail: `Note : <span class='text-yellow-500 font-bold'>${ev.noteGlobale || ev.note || '-'}/5</span> ${ev.commentaire ? '— ' + ev.commentaire : ''}`
      }))
    );
    historique.sort((a, b) => new Date(b.date) - new Date(a.date));
    historiqueCache = historique;
    renderHistorique(historique);
    showFeedback('Historique chargé avec succès', 'success');
  } catch (err) {
    body.innerHTML = '<tr><td colspan="3" class="text-danger text-center py-8">Erreur lors du chargement</td></tr>';
    showFeedback('Erreur lors du chargement de l\'historique', 'error');
  }
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Initialisation
loadHistorique();

document.getElementById('apply-filters').addEventListener('click', applyFilters);
document.getElementById('reset-filters').addEventListener('click', resetFilters); 