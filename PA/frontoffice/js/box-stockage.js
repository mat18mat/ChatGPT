if (!AuthService.isAuthenticated()) {
  window.location.href = 'login.html';
}

const currentUser = AuthService.getCurrentUser();
const token = localStorage.getItem('token');

// Charger les box de l'utilisateur
async function loadBoxList() {
  const list = document.getElementById('box-list');
  list.innerHTML = '<div class="text-gray-400 text-center py-8">Chargement...</div>';
  try {
    const res = await fetch(`/api/boxStockage/user/${currentUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erreur API');
    const boxList = await res.json();
    if (!boxList.length) {
      list.innerHTML = '<div class="text-gray-400 text-center py-8">Aucune box trouvée</div>';
      return;
    }
    list.innerHTML = '';
    boxList.forEach(box => {
      list.innerHTML += renderBoxCard(box);
    });
    // Actions libérer
    list.querySelectorAll('.btn-liberer').forEach(btn => {
      btn.addEventListener('click', async () => {
        await libererBox(btn.dataset.id);
        loadBoxList();
      });
    });
  } catch (err) {
    list.innerHTML = '<div class="text-danger text-center py-8">Erreur lors du chargement</div>';
  }
}

function renderBoxCard(box) {
  const etat = box.etat || 'Réservée';
  return `<div class="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col justify-between card-hover">
    <div>
      <div class="flex items-center mb-2">
        <i class="fas fa-box text-2xl text-primary mr-2"></i>
        <span class="font-bold text-lg">Box #${box.id}</span>
        <span class="ml-3 px-2 py-1 rounded text-xs ${etat === 'Disponible' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} ml-auto">${etat}</span>
      </div>
      <div class="text-gray-600 text-sm mb-2">${box.description || ''}</div>
      <div class="text-xs text-gray-400 mb-2">Taille : ${box.taille} | Type : ${box.type} | Entrepôt : ${box.idEntrepot}</div>
      <div class="text-xs text-gray-400 mb-2">Du ${formatDate(box.dateDebut)} au ${formatDate(box.dateFin)}</div>
      <div class="text-sm font-medium">${box.assurance ? '<span class=\'text-primary\'>Assuré</span>' : '<span class=\'text-gray-400\'>Non assuré</span>'}</div>
    </div>
    <div class="mt-4 flex flex-col gap-2">
      ${etat === 'Réservée' ? `<button class="btn-liberer bg-danger text-white px-4 py-2 rounded hover:bg-danger/80 transition" data-id="${box.id}">Libérer</button>` : ''}
    </div>
  </div>`;
}

// Réserver une box
window.openBoxModal = function() {
  document.getElementById('box-modal').classList.remove('hidden');
};
window.closeBoxModal = function() {
  document.getElementById('box-modal').classList.add('hidden');
  document.getElementById('box-form').reset();
};

document.getElementById('box-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = {
    taille: document.getElementById('box-taille').value,
    type: document.getElementById('box-type').value,
    idEntrepot: document.getElementById('box-entrepot').value,
    dateDebut: document.getElementById('box-date-debut').value,
    dateFin: document.getElementById('box-date-fin').value,
    assurance: document.getElementById('box-assurance').checked,
    description: document.getElementById('box-description').value,
    idUtilisateur: currentUser.id
  };
  try {
    const res = await fetch('/api/boxStockage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erreur API');
    closeBoxModal();
    loadBoxList();
  } catch (err) {
    alert('Erreur lors de la réservation du box');
  }
});

// Libérer une box
async function libererBox(boxId) {
  await fetch(`/api/boxStockage/${boxId}/liberer`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Initialisation
loadBoxList(); 