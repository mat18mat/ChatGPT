// Variables spécifiques aux livraisons
let coursesCurrentPage = 1;
let currentCourseId = null;
const itemsPerPage = 10; // Define itemsPerPage

// Vérification de l'authentification admin
if (!localStorage.getItem('adminToken')) {
  window.location.href = 'login.html';
}

const API_URL = '/api/livraisons'; // À adapter selon ton backend
const livraisonsList = document.getElementById('livraisons-list');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const refreshBtn = document.getElementById('refresh');
const modal = document.getElementById('livraison-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

let livraisons = [];
let filteredLivraisons = [];

function showSkeletons() {
  livraisonsList.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    livraisonsList.innerHTML += `<tr><td colspan="8"><div class="animate-pulse h-6 bg-blue-100 rounded w-full my-2"></div></td></tr>`;
  }
}

function badgeClass(status) {
  switch (status) {
    case 'en-cours': return 'badge en-cours bg-blue-100 text-blue-700';
    case 'terminee': return 'badge terminee bg-green-100 text-green-700';
    case 'annulee': return 'badge annulee bg-red-100 text-red-700';
    default: return 'badge';
  }
}

function renderLivraisons(list) {
  if (!list.length) {
    livraisonsList.innerHTML = '<tr><td colspan="8" class="text-center text-gray-500">Aucune livraison trouvée.</td></tr>';
    return;
  }
  livraisonsList.innerHTML = list.map(l => `
    <tr>
      <td>${l.id}</td>
      <td>${l.createur?.email || '-'}</td>
      <td>${l.livreur?.email || '-'}</td>
      <td>${l.colis ? l.colis.length : '-'}</td>
      <td>${l.montant ? l.montant + ' €' : '-'}</td>
      <td><span class="${badgeClass(l.statut)}">${l.statut}</span></td>
      <td>${l.date ? new Date(l.date).toLocaleDateString() : '-'}</td>
      <td class="actions-btn">
        <button class="btn bg-blue-100 text-blue-700 hover:bg-blue-200" onclick="showLivraisonDetails(${l.id})"><i class="fas fa-eye"></i></button>
        <button class="btn bg-red-100 text-red-700 hover:bg-red-200" onclick="deleteLivraison(${l.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

async function fetchLivraisons() {
  showSkeletons();
  try {
    const res = await fetch(API_URL, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    const data = await res.json();
    livraisons = data;
    applyFilters();
  } catch (e) {
    livraisonsList.innerHTML = '<tr><td colspan="8" class="text-center text-red-500">Erreur de chargement.</td></tr>';
  }
}

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const status = filterStatus.value;
  filteredLivraisons = livraisons.filter(l => {
    const matchQ = (l.createur?.email || '').toLowerCase().includes(q) || (l.livreur?.email || '').toLowerCase().includes(q);
    const matchStatus = !status || l.statut === status;
    return matchQ && matchStatus;
  });
  renderLivraisons(filteredLivraisons);
}

window.showLivraisonDetails = function(id) {
  const l = livraisons.find(l => l.id === id);
  if (!l) return;
  modalBody.innerHTML = `
    <div class="modal-header text-blue-700">Détails de la livraison #${l.id}</div>
    <div><b>Créateur :</b> ${l.createur?.email || '-'}</div>
    <div><b>Livreur :</b> ${l.livreur?.email || '-'}</div>
    <div><b>Colis :</b> ${l.colis ? l.colis.length : '-'}</div>
    <div><b>Montant :</b> ${l.montant ? l.montant + ' €' : '-'}</div>
    <div><b>Statut :</b> <span class="${badgeClass(l.statut)}">${l.statut}</span></div>
    <div><b>Date :</b> ${l.date ? new Date(l.date).toLocaleString() : '-'}</div>
    <div class="mt-4 flex gap-2">
      <button class="btn bg-red-100 text-red-700 hover:bg-red-200" onclick="deleteLivraison(${l.id})"><i class='fas fa-trash'></i> Supprimer</button>
    </div>
  `;
  modal.style.display = 'flex';
}

window.deleteLivraison = async function(id) {
  if (!confirm('Supprimer cette livraison ?')) return;
  showLoader();
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') }
    });
    hideLoader();
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    livraisons = livraisons.filter(l => l.id !== id);
    applyFilters();
    modal.style.display = 'none';
    showToast('Livraison supprimée avec succès.', 'success');
  } catch (e) {
    hideLoader();
    showToast('Erreur lors de la suppression.', 'error');
  }
}

closeModal.onclick = () => { modal.style.display = 'none'; };
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
refreshBtn.addEventListener('click', fetchLivraisons);

document.addEventListener('DOMContentLoaded', async () => {
  // Statistiques livraisons
  try {
    const livraisons = await fetch('/api/livraisons').then(r => r.json());
    document.getElementById('stat-livraisons-total').textContent = livraisons.length;
    document.getElementById('stat-livraisons-encours').textContent = livraisons.filter(l => l.statut === 'en-cours').length;
    document.getElementById('stat-livraisons-terminees').textContent = livraisons.filter(l => l.statut === 'terminee').length;
    document.getElementById('stat-livraisons-annulees').textContent = livraisons.filter(l => l.statut === 'annulee').length;
  } catch (e) {}
});

document.addEventListener('DOMContentLoaded', fetchLivraisons);

// Initialisation de la section livraisons
function initLivraisons() {
    loadCourses();
    loadUtilisateursForCourses();
    loadLivreursForCourses();
    
    // Event listeners
    document.getElementById('search-courses').addEventListener('input', debounce(loadCourses, 300));
    document.getElementById('filter-statut-course').addEventListener('change', loadCourses);
    document.getElementById('course-form').addEventListener('submit', handleCourseFormSubmit);
}

// Chargement des courses
async function loadCourses() {
    try {
        const searchTerm = document.getElementById('search-courses')?.value || '';
        const statutFilter = document.getElementById('filter-statut-course')?.value || '';
        
        const params = new URLSearchParams({
            page: coursesCurrentPage,
            limit: itemsPerPage,
            search: searchTerm,
            statut: statutFilter
        });

        const data = await apiRequest(`/courses?${params}`);
        displayCourses(data.courses || data);
        
        if (data.total !== undefined) {
            updatePagination(data.total, data.page || coursesCurrentPage, '');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des courses:', error);
        showNotification('Erreur lors du chargement des livraisons', 'error');
    }
}

// Affichage des courses
function displayCourses(courses) {
    const tbody = document.getElementById('courses-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.IdCourse}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${course.expediteur_nom || 'N/A'} ${course.expediteur_prenom || ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${course.livreur_nom ? `${course.livreur_nom} ${course.livreur_prenom || ''}` : 'Non assigné'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(course.Statut)}">
                    ${course.Statut}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${course.Prix}€</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(course.Debut)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewCourseDetails(${course.IdCourse})" class="text-primary hover:text-blue-900 mr-3">
                    Voir
                </button>
                <button onclick="editCourse(${course.IdCourse})" class="text-green-600 hover:text-green-900 mr-3">
                    Modifier
                </button>
                <button onclick="deleteCourse(${course.IdCourse})" class="text-red-600 hover:text-red-900">
                    Supprimer
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Voir les détails d'une course
async function viewCourseDetails(id) {
    try {
        const course = await apiRequest(`/courses/${id}`);
        
        const detailsHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold mb-2">Informations générales</h4>
                    <p><strong>ID:</strong> ${course.IdCourse}</p>
                    <p><strong>Statut:</strong> <span class="px-2 py-1 rounded ${getStatutColor(course.Statut)}">${course.Statut}</span></p>
                    <p><strong>Prix:</strong> ${course.Prix}€</p>
                    <p><strong>Description:</strong> ${course.Description || 'Aucune'}</p>
                    <p><strong>Adresse départ:</strong> ${course.AdresseDepart}</p>
                    <p><strong>Adresse arrivée:</strong> ${course.AdresseArrivee}</p>
                    <p><strong>Début:</strong> ${formatDate(course.Debut)}</p>
                    <p><strong>Fin:</strong> ${formatDate(course.Fin)}</p>
                    <p><strong>Validé:</strong> ${course.Valide ? 'Oui' : 'Non'}</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Participants</h4>
                    <p><strong>Expéditeur:</strong> ${course.expediteur_nom || 'N/A'} ${course.expediteur_prenom || ''}</p>
                    <p><strong>Email:</strong> ${course.expediteur_email || 'N/A'}</p>
                    <p><strong>Téléphone:</strong> ${course.expediteur_telephone || 'N/A'}</p>
                    ${course.livreur_nom ? `
                        <p><strong>Livreur:</strong> ${course.livreur_nom} ${course.livreur_prenom || ''}</p>
                        <p><strong>Véhicule:</strong> ${course.livreur_vehicule || 'N/A'}</p>
                    ` : '<p><strong>Livreur:</strong> Non assigné</p>'}
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="font-semibold mb-2">Colis transportés</h4>
                <div id="colis-list">
                    <div class="text-center py-4">Chargement...</div>
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="font-semibold mb-2">Étapes de livraison</h4>
                <div id="etapes-list">
                    <div class="text-center py-4">Chargement...</div>
                </div>
            </div>
        `;

        document.getElementById('course-details-content').innerHTML = detailsHtml;
        
        // Charger les colis et étapes
        loadColisByCourse(id);
        loadEtapesByCourse(id);
        
        showModal('modal-course-details');
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        showNotification('Erreur lors du chargement des détails', 'error');
    }
}

// Charger les colis d'une course
async function loadColisByCourse(courseId) {
    try {
        const colis = await apiRequest(`/colis?course=${courseId}`);
        
        const colisHtml = colis.length > 0 ? colis.map(c => `
            <div class="border p-3 rounded mb-2">
                <p><strong>Description:</strong> ${c.Description || 'N/A'}</p>
                <p><strong>Dimensions:</strong> ${c.Dimensions || 'N/A'}</p>
                <p><strong>Destinataire:</strong> ${c.destinataire_nom || 'N/A'} ${c.destinataire_prenom || ''}</p>
            </div>
        `).join('') : '<p class="text-gray-500">Aucun colis</p>';

        document.getElementById('colis-list').innerHTML = colisHtml;
    } catch (error) {
        console.error('Erreur lors du chargement des colis:', error);
        document.getElementById('colis-list').innerHTML = '<p class="text-red-500">Erreur lors du chargement</p>';
    }
}

// Charger les étapes d'une course
async function loadEtapesByCourse(courseId) {
    try {
        const etapes = await apiRequest(`/etapes?course=${courseId}`);
        
        const etapesHtml = etapes.length > 0 ? etapes.map(e => `
            <div class="border p-3 rounded mb-2 ${e.Valide ? 'bg-green-50' : 'bg-gray-50'}">
                <p><strong>Nom:</strong> ${e.Nom || 'N/A'}</p>
                <p><strong>Description:</strong> ${e.Description || 'N/A'}</p>
                <p><strong>Statut:</strong> ${e.Valide ? 'Validée' : 'En attente'}</p>
                <p><strong>Horaires:</strong> ${e.TempsDebut || 'N/A'} - ${e.TempsFin || 'N/A'}</p>
            </div>
        `).join('') : '<p class="text-gray-500">Aucune étape</p>';

        document.getElementById('etapes-list').innerHTML = etapesHtml;
    } catch (error) {
        console.error('Erreur lors du chargement des étapes:', error);
        document.getElementById('etapes-list').innerHTML = '<p class="text-red-500">Erreur lors du chargement</p>';
    }
}

// Créer une nouvelle course
function showCreateCourseModal() {
    currentCourseId = null;
    document.getElementById('course-form-title').textContent = 'Nouvelle Livraison';
    document.getElementById('course-form').reset();
    showModal('modal-course-form');
}

// Modifier une course
async function editCourse(id) {
    try {
        const course = await apiRequest(`/courses/${id}`);
        currentCourseId = id;
        
        document.getElementById('course-form-title').textContent = 'Modifier la Livraison';
        
        // Remplir le formulaire
        document.getElementById('adresse-depart').value = course.AdresseDepart || '';
        document.getElementById('adresse-arrivee').value = course.AdresseArrivee || '';
        document.getElementById('debut').value = course.Debut ? new Date(course.Debut).toISOString().slice(0, 16) : '';
        document.getElementById('fin').value = course.Fin ? new Date(course.Fin).toISOString().slice(0, 16) : '';
        document.getElementById('prix').value = course.Prix || '';
        document.getElementById('statut').value = course.Statut || '';
        document.getElementById('expediteur').value = course.IdExpediteur || '';
        document.getElementById('livreur').value = course.IdLivreur || '';
        document.getElementById('description').value = course.Description || '';
        
        showModal('modal-course-form');
    } catch (error) {
        console.error('Erreur lors du chargement de la course:', error);
        showNotification('Erreur lors du chargement de la course', 'error');
    }
}

// Supprimer une course
async function deleteCourse(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
        return;
    }

    try {
        await apiRequest(`/courses/${id}`, { method: 'DELETE' });
        showNotification('Livraison supprimée avec succès', 'success');
        loadCourses();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Gestion du formulaire de course
async function handleCourseFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm('course-form')) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const formData = {
        AdresseDepart: document.getElementById('adresse-depart').value,
        AdresseArrivee: document.getElementById('adresse-arrivee').value,
        Debut: document.getElementById('debut').value,
        Fin: document.getElementById('fin').value,
        Prix: parseFloat(document.getElementById('prix').value),
        Statut: document.getElementById('statut').value,
        IdExpediteur: parseInt(document.getElementById('expediteur').value),
        IdLivreur: document.getElementById('livreur').value ? parseInt(document.getElementById('livreur').value) : null,
        Description: document.getElementById('description').value
    };

    try {
        if (currentCourseId) {
            // Modification
            await apiRequest(`/courses/${currentCourseId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Livraison modifiée avec succès', 'success');
        } else {
            // Création
            await apiRequest('/courses', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Livraison créée avec succès', 'success');
        }
        
        closeModal('modal-course-form');
        loadCourses();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

// Charger les utilisateurs pour le formulaire
async function loadUtilisateursForCourses() {
    try {
        const utilisateurs = await loadUtilisateurs();
        populateSelect('expediteur', utilisateurs, 'IdUtilisateur', 
            user => `${user.Nom} ${user.Prenom} (${user.Mail})`, 'Sélectionner un expéditeur');
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
}

// Charger les livreurs pour le formulaire
async function loadLivreursForCourses() {
    try {
        const livreurs = await loadLivreurs();
        populateSelect('livreur', livreurs, 'IdLivreur', 
            livreur => `${livreur.utilisateur_nom} ${livreur.utilisateur_prenom} (${livreur.Vehicule})`, 'Sélectionner un livreur');
    } catch (error) {
        console.error('Erreur lors du chargement des livreurs:', error);
    }
}

// Pagination
function previousPageCourses() {
    if (coursesCurrentPage > 1) {
        coursesCurrentPage--;
        loadCourses();
    }
}

function nextPageCourses() {
    coursesCurrentPage++;
    loadCourses();
}