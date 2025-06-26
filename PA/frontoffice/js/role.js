document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier si l'utilisateur est connecté
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
        window.location.href = 'login.html';
        return;
    }

    // Configuration des rôles (icônes, noms, descriptions)
    const roleConfig = {
        client: {
            icon: 'fas fa-user',
            name: 'Client',
            description: 'Accédez à vos commandes et suivez vos livraisons'
        },
        prestataire: {
            icon: 'fas fa-briefcase',
            name: 'Prestataire',
            description: 'Gérez vos services et vos prestations'
        },
        commercant: {
            icon: 'fas fa-store',
            name: 'Commerçant',
            description: 'Gérez votre boutique et vos commandes'
        },
        livreur: {
            icon: 'fas fa-truck',
            name: 'Livreur',
            description: 'Gérez vos livraisons et votre planning'
        }
    };

    try {
        // Récupérer les rôles de l'utilisateur
        const userRoles = await RoleService.getUserRoles(currentUser.id);
        const rolesContainer = document.getElementById('roles-container');
        const template = document.getElementById('role-card-template');

        // Créer une carte pour chaque rôle disponible
        userRoles.forEach(role => {
            if (roleConfig[role]) {
                const card = template.content.cloneNode(true);
                const roleCard = card.querySelector('.role-card');
                const icon = card.querySelector('.role-icon');
                const name = card.querySelector('.role-name');
                const description = card.querySelector('.role-description');

                // Configurer la carte
                icon.className = `${roleConfig[role].icon} text-4xl mb-3 text-indigo-600`;
                name.textContent = roleConfig[role].name;
                description.textContent = roleConfig[role].description;
                roleCard.setAttribute('tabindex', '0');
                roleCard.setAttribute('role', 'button');
                roleCard.setAttribute('aria-label', `Choisir le rôle ${roleConfig[role].name}`);

                // Effet de sélection visuel
                if (localStorage.getItem('currentRole') === role) {
                    roleCard.classList.add('role-selected');
                }

                // Sélection par clic ou clavier
                const selectRole = async () => {
                    try {
                        localStorage.setItem('currentRole', role);
                        showFeedback(`Espace ${roleConfig[role].name} sélectionné !`, 'success');
                        // Animation visuelle
                        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('role-selected'));
                        roleCard.classList.add('role-selected');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 600);
                    } catch (error) {
                        showFeedback('Une erreur est survenue lors de la sélection du rôle.', 'error');
                    }
                };
                roleCard.addEventListener('click', selectRole);
                roleCard.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        selectRole();
                    }
                });

                rolesContainer.appendChild(card);
            }
        });

        if (userRoles.length === 0) {
            showFeedback('Aucun rôle disponible pour cet utilisateur.', 'error');
        }
    } catch (error) {
        showFeedback('Une erreur est survenue lors du chargement des rôles.', 'error');
    }
});

// Feedback global harmonisé
function showFeedback(message, type = 'info') {
    const feedback = document.getElementById('feedback-message');
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