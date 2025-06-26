// Variables spécifiques aux box
let boxesCurrentPage = 1
let currentBoxId = null
const itemsPerPage = 10 // Define itemsPerPage

// Vérification de l'authentification admin
if (!localStorage.getItem('adminToken')) {
  window.location.href = 'login.html';
}

const API_URL = '/api/boxes'; // À adapter selon ton backend
const boxesList = document.getElementById('boxes-list');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const refreshBtn = document.getElementById('refresh');
const modal = document.getElementById('box-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

let boxes = [];
let filteredBoxes = [];

// Initialisation de la section box
function initBoxes() {
  loadBoxes()
  loadEntrepotsForBoxes()
  loadUtilisateursForBoxes()
  loadBoxesStats()

  // Event listeners
  document.getElementById("filter-entrepot").addEventListener("change", loadBoxes)
  document.getElementById("filter-statut-box").addEventListener("change", loadBoxes)
  document.getElementById("filter-taille").addEventListener("change", loadBoxes)
  document.getElementById("box-form").addEventListener("submit", handleBoxFormSubmit)
}

// Chargement des box
async function loadBoxes() {
  showSkeletons();
  try {
    const entrepotFilter = document.getElementById("filter-entrepot")?.value || ""
    const statutFilter = document.getElementById("filter-statut-box")?.value || ""
    const tailleFilter = document.getElementById("filter-taille")?.value || ""

    const params = new URLSearchParams({
      page: boxesCurrentPage,
      limit: itemsPerPage,
      entrepot: entrepotFilter,
      statut: statutFilter,
      taille: tailleFilter,
    })

    const res = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    const data = await res.json();
    boxes = data;
    applyFilters();

    if (data.total !== undefined) {
      updatePagination(data.total, data.page || boxesCurrentPage, "boxes")
    }
  } catch (error) {
    console.error("Erreur lors du chargement des box:", error)
    showNotification("Erreur lors du chargement des box", "error")
  }
}

// Affichage des box
function displayBoxes(boxes) {
  const grid = document.getElementById("boxes-grid")
  if (!grid) return

  grid.innerHTML = ""

  boxes.forEach((box) => {
    const card = document.createElement("div")
    card.className = "bg-white border rounded-lg p-4 shadow hover:shadow-md transition-shadow"

    const isExpired = new Date(box.DateFin) < new Date()
    const statusColor = isExpired ? "bg-red-100 text-red-800" : getStatutColor(box.Statut)

    card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-lg">Box #${box.IdBox}</h3>
                <span class="px-2 py-1 text-xs rounded-full ${statusColor}">
                    ${isExpired ? "Expirée" : box.Statut}
                </span>
            </div>
            <div class="space-y-2 text-sm">
                <p><strong>Utilisateur:</strong> ${box.utilisateur_nom} ${box.utilisateur_prenom}</p>
                <p><strong>Entrepôt:</strong> ${box.entrepot_localisation}</p>
                <p><strong>Secteur:</strong> ${box.entrepot_secteur || "N/A"}</p>
                <p><strong>Taille:</strong> <span class="capitalize">${box.Taille}</span></p>
                <p><strong>Type:</strong> <span class="capitalize">${box.TypeBox}</span></p>
                <p><strong>Période:</strong> ${formatDateOnly(box.DateDebut)} - ${formatDateOnly(box.DateFin)}</p>
                <p><strong>Assurance:</strong> ${box.Assurance ? "Oui" : "Non"}</p>
                ${box.Description ? `<p><strong>Description:</strong> ${truncateText(box.Description, 50)}</p>` : ""}
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button onclick="viewBoxDetails(${box.IdBox})" class="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Détails
                </button>
                <button onclick="manageBoxAccess(${box.IdBox})" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Accès
                </button>
                <button onclick="editBox(${box.IdBox})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                    Modifier
                </button>
                <button onclick="deleteBox(${box.IdBox})" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Supprimer
                </button>
            </div>
        `
    grid.appendChild(card)
  })
}

// Voir les détails d'une box
async function viewBoxDetails(id) {
  try {
    const box = await apiRequest(`/boxes/${id}`)

    const detailsHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold mb-2">Informations de la box</h4>
                    <p><strong>ID:</strong> ${box.IdBox}</p>
                    <p><strong>Statut:</strong> <span class="px-2 py-1 rounded ${getStatutColor(box.Statut)}">${box.Statut}</span></p>
                    <p><strong>Taille:</strong> <span class="capitalize">${box.Taille}</span></p>
                    <p><strong>Type:</strong> <span class="capitalize">${box.TypeBox}</span></p>
                    <p><strong>Assurance:</strong> ${box.Assurance ? "Oui" : "Non"}</p>
                    <p><strong>Date début:</strong> ${formatDateOnly(box.DateDebut)}</p>
                    <p><strong>Date fin:</strong> ${formatDateOnly(box.DateFin)}</p>
                    ${box.Description ? `<p><strong>Description:</strong> ${box.Description}</p>` : ""}
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Utilisateur et entrepôt</h4>
                    <p><strong>Propriétaire:</strong> ${box.utilisateur_nom} ${box.utilisateur_prenom}</p>
                    <p><strong>Email:</strong> ${box.utilisateur_email || "N/A"}</p>
                    <p><strong>Téléphone:</strong> ${box.utilisateur_telephone || "N/A"}</p>
                    <p><strong>Entrepôt:</strong> ${box.entrepot_localisation}</p>
                    <p><strong>Secteur:</strong> ${box.entrepot_secteur || "N/A"}</p>
                    <p><strong>Capacité entrepôt:</strong> ${box.entrepot_capacite || "N/A"}</p>
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="font-semibold mb-2">Accès autorisés</h4>
                <div id="box-access-list">
                    <div class="text-center py-4">Chargement...</div>
                </div>
            </div>
        `

    document.getElementById("box-details-content").innerHTML = detailsHtml

    // Charger les accès
    loadBoxAccessList(id)

    showModal("modal-box-details")
  } catch (error) {
    console.error("Erreur lors du chargement des détails de la box:", error)
    showNotification("Erreur lors du chargement des détails", "error")
  }
}

// Charger la liste des accès d'une box
async function loadBoxAccessList(boxId) {
  try {
    const accesses = await apiRequest(`/boxes/access?box=${boxId}`)

    const accessHtml =
      accesses.length > 0
        ? accesses
            .map(
              (access) => `
            <div class="flex justify-between items-center p-2 border rounded mb-2">
                <div>
                    <span class="font-medium">${access.EmailInvite}</span>
                    <span class="text-sm text-gray-500 ml-2">(${access.TypeAcces})</span>
                </div>
                <span class="text-xs text-gray-400">ID: ${access.IdAccess}</span>
            </div>
        `,
            )
            .join("")
        : '<p class="text-gray-500">Aucun accès configuré</p>'

    document.getElementById("box-access-list").innerHTML = accessHtml
  } catch (error) {
    console.error("Erreur lors du chargement des accès:", error)
    document.getElementById("box-access-list").innerHTML = '<p class="text-red-500">Erreur lors du chargement</p>'
  }
}

// Créer une nouvelle box
function showCreateBoxModal() {
  currentBoxId = null
  document.getElementById("box-form-title").textContent = "Nouvelle Box"
  document.getElementById("box-form").reset()
  showModal("modal-box-form")
}

// Modifier une box
async function editBox(id) {
  try {
    const box = await apiRequest(`/boxes/${id}`)
    currentBoxId = id

    document.getElementById("box-form-title").textContent = "Modifier la Box"

    // Remplir le formulaire
    document.getElementById("box-utilisateur").value = box.IdUtilisateur || ""
    document.getElementById("box-entrepot").value = box.IdEntrepot || ""
    document.getElementById("box-date-debut").value = box.DateDebut ? box.DateDebut.split("T")[0] : ""
    document.getElementById("box-date-fin").value = box.DateFin ? box.DateFin.split("T")[0] : ""
    document.getElementById("box-taille").value = box.Taille || ""
    document.getElementById("box-type").value = box.TypeBox || ""
    document.getElementById("box-statut").value = box.Statut || ""
    document.getElementById("box-assurance").value = box.Assurance ? "true" : "false"
    document.getElementById("box-description").value = box.Description || ""

    showModal("modal-box-form")
  } catch (error) {
    console.error("Erreur lors du chargement de la box:", error)
    showNotification("Erreur lors du chargement de la box", "error")
  }
}

// Supprimer une box
window.deleteBox = async function(id) {
  if (!confirm('Supprimer cette box ?')) return;
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    hideLoader();
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    boxes = boxes.filter(b => b.id !== id);
    applyFilters();
    modal.style.display = 'none';
    showToast('Box supprimée avec succès.', 'success');
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression.', 'error');
  }
}

// Gestion du formulaire de box
async function handleBoxFormSubmit(event) {
  event.preventDefault()

  if (!validateForm("box-form")) {
    showNotification("Veuillez remplir tous les champs obligatoires", "error")
    return
  }

  const formData = {
    IdUtilisateur: Number.parseInt(document.getElementById("box-utilisateur").value),
    IdEntrepot: Number.parseInt(document.getElementById("box-entrepot").value),
    DateDebut: document.getElementById("box-date-debut").value,
    DateFin: document.getElementById("box-date-fin").value,
    Taille: document.getElementById("box-taille").value,
    TypeBox: document.getElementById("box-type").value,
    Statut: document.getElementById("box-statut").value,
    Assurance: document.getElementById("box-assurance").value === "true",
    Description: document.getElementById("box-description").value,
  }

  try {
    if (currentBoxId) {
      // Modification
      await apiRequest(`/boxes/${currentBoxId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })
      showNotification("Box modifiée avec succès", "success")
    } else {
      // Création
      await apiRequest("/boxes", {
        method: "POST",
        body: JSON.stringify(formData),
      })
      showNotification("Box créée avec succès", "success")
    }

    closeModal("modal-box-form")
    loadBoxes()
    loadBoxesStats()
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    showNotification("Erreur lors de la sauvegarde", "error")
  }
}

// Gérer les accès d'une box
async function manageBoxAccess(boxId) {
  try {
    const accesses = await apiRequest(`/boxes/access?box=${boxId}`)

    const accessHtml = `
            <div class="mb-4">
                <h4 class="font-semibold mb-2">Accès existants</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                    ${
                      accesses
                        .map(
                          (access) => `
                        <div class="flex justify-between items-center p-2 border rounded">
                            <div>
                                <span class="font-medium">${access.EmailInvite}</span>
                                <span class="text-sm text-gray-500 ml-2">(${access.TypeAcces})</span>
                            </div>
                            <button onclick="removeAccess(${access.IdAccess}, ${boxId})" class="text-red-600 hover:text-red-800 text-sm">
                                Supprimer
                            </button>
                        </div>
                    `,
                        )
                        .join("") || '<p class="text-gray-500">Aucun accès configuré</p>'
                    }
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold mb-2">Ajouter un accès</h4>
                <div class="space-y-3">
                    <input type="email" id="new-access-email" placeholder="Email de l'utilisateur" class="w-full px-3 py-2 border rounded">
                    <select id="new-access-type" class="w-full px-3 py-2 border rounded">
                        <option value="lecture">Lecture seule</option>
                        <option value="complet">Accès complet</option>
                    </select>
                    <button onclick="addAccess(${boxId})" class="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                        Ajouter l'accès
                    </button>
                </div>
            </div>
        `

    document.getElementById("access-content").innerHTML = accessHtml
    showModal("modal-access")
  } catch (error) {
    console.error("Erreur lors du chargement des accès:", error)
    showNotification("Erreur lors du chargement des accès", "error")
  }
}

// Ajouter un accès
async function addAccess(boxId) {
  const email = document.getElementById("new-access-email").value
  const type = document.getElementById("new-access-type").value

  if (!email) {
    showNotification("Veuillez saisir un email", "error")
    return
  }

  try {
    await apiRequest("/boxes/access", {
      method: "POST",
      body: JSON.stringify({
        IdBox: boxId,
        EmailInvite: email,
        TypeAcces: type,
      }),
    })

    showNotification("Accès ajouté avec succès", "success")
    manageBoxAccess(boxId) // Recharger la liste
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'accès:", error)
    showNotification("Erreur lors de l'ajout de l'accès", "error")
  }
}

// Supprimer un accès
async function removeAccess(accessId, boxId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet accès ?")) {
    return
  }

  try {
    await apiRequest(`/boxes/access/${accessId}`, { method: "DELETE" })
    showNotification("Accès supprimé avec succès", "success")
    manageBoxAccess(boxId) // Recharger la liste
  } catch (error) {
    console.error("Erreur lors de la suppression de l'accès:", error)
    showNotification("Erreur lors de la suppression de l'accès", "error")
  }
}

// Charger les statistiques des box
async function loadBoxesStats() {
  try {
    const boxes = await apiRequest("/boxes")
    const boxesArray = boxes.boxes || boxes

    const total = boxesArray.length
    const active = boxesArray.filter((box) => box.Statut === "active").length
    const available = boxesArray.filter((box) => box.Statut === "en attente").length
    const expired = boxesArray.filter((box) => new Date(box.DateFin) < new Date()).length

    document.getElementById("total-boxes").textContent = total
    document.getElementById("active-boxes").textContent = active
    document.getElementById("available-boxes").textContent = available
    document.getElementById("expired-boxes").textContent = expired
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error)
  }
}

// Charger les entrepôts pour le formulaire
async function loadEntrepotsForBoxes() {
  try {
    const entrepots = await loadEntrepots()
    populateSelect(
      "filter-entrepot",
      entrepots,
      "IdEntrepot",
      (entrepot) => `${entrepot.Localisation} - ${entrepot.Secteur}`,
      "Tous les entrepôts",
    )
    populateSelect(
      "box-entrepot",
      entrepots,
      "IdEntrepot",
      (entrepot) => `${entrepot.Localisation} - ${entrepot.Secteur}`,
      "Sélectionner un entrepôt",
    )
  } catch (error) {
    console.error("Erreur lors du chargement des entrepôts:", error)
  }
}

// Charger les utilisateurs pour le formulaire
async function loadUtilisateursForBoxes() {
  try {
    const utilisateurs = await loadUtilisateurs()
    populateSelect(
      "box-utilisateur",
      utilisateurs,
      "IdUtilisateur",
      (user) => `${user.Nom} ${user.Prenom} (${user.Mail})`,
      "Sélectionner un utilisateur",
    )
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error)
  }
}

// Pagination
function previousPageBoxes() {
  if (boxesCurrentPage > 1) {
    boxesCurrentPage--
    loadBoxes()
  }
}

function nextPageBoxes() {
  boxesCurrentPage++
  loadBoxes()
}

// Fonction utilitaire pour tronquer le texte
function truncateText(text, maxLength) {
  if (!text) return "N/A"
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

function showSkeletons() {
  boxesList.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    boxesList.innerHTML += `<tr><td colspan="7"><div class="animate-pulse h-6 bg-pink-100 rounded w-full my-2"></div></td></tr>`;
  }
}

function badgeClass(status) {
  switch (status) {
    case 'disponible': return 'badge disponible bg-green-100 text-green-700';
    case 'reserve': return 'badge reserve bg-yellow-100 text-yellow-700';
    case 'occupee': return 'badge occupee bg-red-100 text-red-700';
    default: return 'badge';
  }
}

function renderBoxes(list) {
  if (!list.length) {
    boxesList.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500">Aucune box trouvée.</td></tr>';
    return;
  }
  boxesList.innerHTML = list.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.nom || '-'}</td>
      <td>${b.emplacement || '-'}</td>
      <td>${b.capacite || '-'}</td>
      <td><span class="${badgeClass(b.statut)}">${b.statut}</span></td>
      <td>${(b.acces && b.acces.length) ? b.acces.map(a => a.utilisateur?.email).join(', ') : '-'}</td>
      <td class="actions-btn">
        <button class="btn bg-pink-100 text-pink-700 hover:bg-pink-200" onclick="showBoxDetails(${b.id})"><i class="fas fa-eye"></i></button>
        <button class="btn bg-blue-100 text-blue-700 hover:bg-blue-200" onclick="manageAccess(${b.id})"><i class="fas fa-key"></i></button>
      </td>
    </tr>
  `).join('');
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  filteredBoxes = boxes.filter(b => {
    const matchQ = (b.nom || '').toLowerCase().includes(q) || (b.emplacement || '').toLowerCase().includes(q);
    const matchStatus = !status || b.statut === status;
    return matchQ && matchStatus;
  });
  renderBoxes(filteredBoxes);
}

window.showBoxDetails = function(id) {
  const b = boxes.find(b => b.id === id);
  if (!b) return;
  modalBody.innerHTML = `
    <div class="modal-header text-pink-700">Détails de la box #${b.id}</div>
    <div><b>Nom :</b> ${b.nom || '-'}</div>
    <div><b>Emplacement :</b> ${b.emplacement || '-'}</div>
    <div><b>Capacité :</b> ${b.capacite || '-'}</div>
    <div><b>Statut :</b> <span class="${badgeClass(b.statut)}">${b.statut}</span></div>
    <div><b>Accès :</b> ${(b.acces && b.acces.length) ? b.acces.map(a => a.utilisateur?.email).join(', ') : '-'}</div>
    <div class="mt-4 flex gap-2">
      <button class="btn bg-blue-100 text-blue-700 hover:bg-blue-200" onclick="manageAccess(${b.id})"><i class='fas fa-key'></i> Gérer les accès</button>
    </div>
  `;
  modal.style.display = 'flex';
}

window.manageAccess = function(id) {
  alert('Fonctionnalité de gestion des accès à implémenter (ajout/suppression d'accès pour les utilisateurs).');
}

closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
refreshBtn.addEventListener('click', loadBoxes);

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques boxes
  try {
    const boxes = await fetch('/api/boxes').then(r => r.json());
    document.getElementById('stat-boxes-total').textContent = boxes.length;
    document.getElementById('stat-boxes-disponibles').textContent = boxes.filter(b => b.statut === 'disponible').length;
    document.getElementById('stat-boxes-reservees').textContent = boxes.filter(b => b.statut === 'reserve').length;
    document.getElementById('stat-boxes-occupees').textContent = boxes.filter(b => b.statut === 'occupee').length;
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', loadBoxes);