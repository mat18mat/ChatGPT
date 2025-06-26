document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification
    if (!requireAuth()) return;

    const currentUser = AuthService.getCurrentUser();
    
    try {
        // Charger les abonnements
        const abonnements = await ApiService.get(`/abonnements/user/${currentUser.id}`);
        displayAbonnements(abonnements);

        // Charger l'historique des paiements
        const paiements = await ApiService.get(`/paiements/user/${currentUser.id}`);
        displayPaiements(paiements);
    } catch (error) {
        console.error('Erreur lors du chargement des abonnements:', error);
        showNotification('Erreur lors du chargement des données', 'error');
    }
});

// Affichage des abonnements
function displayAbonnements(abonnements) {
    const container = document.querySelector('#abonnementsContainer');
    if (!container) return;

    if (abonnements.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-600">Vous n'avez pas encore d'abonnement actif.</p>
                <button onclick="showAbonnementOptions()" 
                        class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Découvrir nos abonnements
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = abonnements.map(abo => `
        <div class="bg-white rounded-lg shadow-md p-6 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-lg font-semibold">${abo.nom}</h3>
                    <p class="text-gray-600">${abo.description}</p>
                    <p class="mt-2">
                        <span class="font-bold text-blue-600">${abo.prix}€</span>
                        <span class="text-gray-500">/ mois</span>
                    </p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm ${
                    abo.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                    ${abo.statut}
                </span>
            </div>
            <div class="mt-4 space-y-2">
                <p class="text-sm text-gray-600">
                    Prochain paiement: ${new Date(abo.dateProchainPaiement).toLocaleDateString()}
                </p>
                <p class="text-sm text-gray-600">
                    Date de fin: ${abo.dateFin ? new Date(abo.dateFin).toLocaleDateString() : 'Abonnement en cours'}
                </p>
            </div>
            <div class="mt-4 flex space-x-4">
                <button onclick="cancelAbonnement(${abo.id})" 
                        class="text-red-600 hover:text-red-800">
                    Résilier
                </button>
                <button onclick="showAbonnementDetails(${abo.id})" 
                        class="text-blue-600 hover:text-blue-800">
                    Détails
                </button>
            </div>
        </div>
    `).join('');
}

// Affichage des paiements
function displayPaiements(paiements) {
    const container = document.querySelector('#paiementsContainer');
    if (!container) return;

    if (paiements.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <p class="text-gray-600">Aucun historique de paiement disponible.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${paiements.map(paiement => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                ${new Date(paiement.date).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                ${paiement.montant}€
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    paiement.statut === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${paiement.statut}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button onclick="downloadFacture(${paiement.id})" 
                                        class="text-blue-600 hover:text-blue-800">
                                    Télécharger la facture
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Annulation d'un abonnement
async function cancelAbonnement(abonnementId) {
    if (!confirm('Êtes-vous sûr de vouloir résilier cet abonnement ?')) {
        return;
    }

    try {
        await ApiService.post(`/abonnements/${abonnementId}/cancel`);
        showNotification('Abonnement résilié avec succès', 'success');
        
        // Recharger les abonnements
        const currentUser = AuthService.getCurrentUser();
        const abonnements = await ApiService.get(`/abonnements/user/${currentUser.id}`);
        displayAbonnements(abonnements);
    } catch (error) {
        console.error('Erreur lors de la résiliation:', error);
        showNotification('Erreur lors de la résiliation', 'error');
    }
}

// Téléchargement de facture
async function downloadFacture(paiementId) {
    try {
        const response = await ApiService.get(`/paiements/${paiementId}/facture`);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = response.url;
        link.download = `facture_${paiementId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showNotification('Erreur lors du téléchargement de la facture', 'error');
    }
}

// Affichage des détails d'un abonnement
async function showAbonnementDetails(abonnementId) {
    try {
        const abonnement = await ApiService.get(`/abonnements/${abonnementId}`);
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full p-6">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-2xl font-bold">${abonnement.nom}</h2>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <p class="text-gray-700">${abonnement.description}</p>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold mb-2">Avantages inclus :</h3>
                        <ul class="list-disc pl-5 space-y-2">
                            ${abonnement.avantages.map(avantage => `
                                <li>${avantage}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Date de début</p>
                            <p class="font-semibold">${new Date(abonnement.dateDebut).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Prochain paiement</p>
                            <p class="font-semibold">${new Date(abonnement.dateProchainPaiement).toLocaleDateString()}</p>
                        </div>
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

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-md shadow-lg z-50`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

if (!AuthService.isAuthenticated()) {
    window.location.href = 'login.html';
}

const currentUser = AuthService.getCurrentUser();
const token = localStorage.getItem('token');

// Charger les abonnements de l'utilisateur
async function loadAbonnements() {
    const list = document.getElementById('abonnements-list');
    list.innerHTML = '<div class="text-gray-400 text-center py-8">Chargement...</div>';
    try {
        const res = await fetch(`/api/abonnement/user/${currentUser.id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
        if (!res.ok) throw new Error('Erreur API');
        const abonnements = await res.json();
        if (!abonnements.length) {
            list.innerHTML = '<div class="text-gray-400 text-center py-8">Aucun abonnement trouvé</div>';
      return;
        }
        list.innerHTML = '';
        abonnements.forEach(ab => {
            list.innerHTML += renderAbonnementCard(ab);
        });
    } catch (err) {
        list.innerHTML = '<div class="text-danger text-center py-8">Erreur lors du chargement</div>';
    }
}

function renderAbonnementCard(ab) {
    const actif = ab.actif;
    return `<div class="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <div class="flex items-center mb-2">
                <i class="fas fa-crown text-2xl text-yellow-400 mr-2"></i>
                <span class="font-bold text-lg">${ab.nom || 'Abonnement'}</span>
                <span class="ml-3 px-2 py-1 rounded text-xs ${actif ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'} ml-auto">${actif ? 'Actif' : 'Expiré'}</span>
            </div>
            <div class="text-gray-600 text-sm mb-2">${ab.description || ''}</div>
            <div class="text-xs text-gray-400 mb-2">Début : ${formatDate(ab.dateDebut)}<br>Fin : ${formatDate(ab.dateFin)}</div>
            <div class="text-sm font-medium">Montant : <span class="text-primary">${ab.montant || 'N/A'} €</span></div>
        </div>
        <div class="mt-4 flex flex-col gap-2">
            ${!actif ? `<button class="btn-renouveler bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition" data-id="${ab.id}">Renouveler</button>` : ''}
            <button class="btn-paiements bg-gray-100 text-primary px-4 py-2 rounded hover:bg-primary/10 transition" data-id="${ab.id}">Voir paiements</button>
          </div>
    </div>`;
}

// Afficher l'historique des paiements (modale simple)
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-paiements')) {
        const abId = e.target.dataset.id;
        showPaiementsModal(abId);
    }
    if (e.target.classList.contains('btn-renouveler')) {
        const abId = e.target.dataset.id;
        await renouvelerAbonnement(abId);
        loadAbonnements();
    }
    if (e.target.id === 'close-paiements-modal') {
        document.getElementById('paiements-modal').remove();
    }
});

async function showPaiementsModal(abId) {
    const res = await fetch(`/api/paiement/abonnement/${abId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const paiements = res.ok ? await res.json() : [];
    const html = `<div id="paiements-modal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button id="close-paiements-modal" class="absolute top-4 right-4 text-gray-400 hover:text-danger"><i class="fas fa-times"></i></button>
            <h3 class="text-xl font-bold mb-4">Historique des paiements</h3>
            <div class="divide-y divide-gray-100">
                ${paiements.length ? paiements.map(p => `
                    <div class="py-2 flex justify-between items-center">
          <div>
                            <div class="font-medium">${formatDate(p.date)}</div>
                            <div class="text-xs text-gray-500">${p.statut || ''}</div>
                        </div>
                        <div class="font-bold text-primary">${p.montant} €</div>
                    </div>
                `).join('') : '<div class="text-gray-400 text-center py-8">Aucun paiement</div>'}
          </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

// Simuler le renouvellement (à adapter selon l'API réelle)
async function renouvelerAbonnement(abId) {
    await fetch(`/api/abonnement/${abId}/renouveler`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Initialisation
loadAbonnements();

document.addEventListener('DOMContentLoaded', () => {
    const stripeSubBtn = document.getElementById('stripe-sub-btn');
    if (!stripeSubBtn) return;

    stripeSubBtn.addEventListener('click', async () => {
        try {
            // À adapter selon l'abonnement choisi : priceId Stripe
            const priceId = 'price_XXXXXXXXXXXXXX'; // Remplacer par l'ID du prix Stripe
            const successUrl = window.location.origin + '/paiement-success.html';
            const cancelUrl = window.location.origin + '/paiement-echec.html';
            const res = await fetch('/api/paiement/stripe-subscription-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, successUrl, cancelUrl })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erreur lors de la création de l\'abonnement');
            const stripe = Stripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'); // Remplacer par ta clé publique Stripe
            await stripe.redirectToCheckout({ sessionId: data.id });
        } catch (e) {
            alert(e.message);
        }
    });
}); 