// frontoffice/ui/sidebar.js

// Récupère le rôle courant depuis le localStorage ou AuthService
function getCurrentRole() {
  return localStorage.getItem('currentRole') || 'client';
}

// Génère la sidebar selon le rôle
function renderSidebar() {
  const role = getCurrentRole();
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Liens par rôle
  const linksByRole = {
    client: [
      { href: 'dashboard.html', label: 'Dashboard', icon: 'fas fa-home' },
      { href: 'annonces.html', label: 'Mes Annonces', icon: 'fas fa-bullhorn' },
      { href: 'abonnements.html', label: 'Abonnements', icon: 'fas fa-crown' },
      { href: 'box-stockage.html', label: 'Box Stockage', icon: 'fas fa-box' },
      { href: 'historique.html', label: 'Historique', icon: 'fas fa-history' },
      { href: 'conversations.html', label: 'Messagerie', icon: 'fas fa-comments' },
      { href: 'profil.html', label: 'Profil', icon: 'fas fa-user' }
    ],
    livreur: [
      { href: 'dashboard.html', label: 'Dashboard', icon: 'fas fa-home' },
      { href: 'livraisons.html', label: 'Mes Livraisons', icon: 'fas fa-truck' },
      { href: 'historique.html', label: 'Historique', icon: 'fas fa-history' },
      { href: 'conversations.html', label: 'Messagerie', icon: 'fas fa-comments' },
      { href: 'profil.html', label: 'Profil', icon: 'fas fa-user' }
    ],
    commercant: [
      { href: 'dashboard.html', label: 'Dashboard', icon: 'fas fa-home' },
      { href: 'produits.html', label: 'Mes Produits', icon: 'fas fa-store' },
      { href: 'historique.html', label: 'Historique', icon: 'fas fa-history' },
      { href: 'conversations.html', label: 'Messagerie', icon: 'fas fa-comments' },
      { href: 'profil.html', label: 'Profil', icon: 'fas fa-user' }
    ],
    prestataire: [
      { href: 'dashboard.html', label: 'Dashboard', icon: 'fas fa-home' },
      { href: 'services.html', label: 'Mes Services', icon: 'fas fa-briefcase' },
      { href: 'historique.html', label: 'Historique', icon: 'fas fa-history' },
      { href: 'conversations.html', label: 'Messagerie', icon: 'fas fa-comments' },
      { href: 'profil.html', label: 'Profil', icon: 'fas fa-user' }
    ],
    admin: [
      { href: 'dashboard.html', label: 'Dashboard', icon: 'fas fa-home' },
      { href: 'utilisateurs.html', label: 'Utilisateurs', icon: 'fas fa-users' },
      { href: 'logs.html', label: 'Logs', icon: 'fas fa-clipboard-list' },
      { href: 'annonces.html', label: 'Annonces', icon: 'fas fa-bullhorn' },
      { href: 'box-stockage.html', label: 'Box Stockage', icon: 'fas fa-box' },
      { href: 'profil.html', label: 'Profil', icon: 'fas fa-user' }
    ]
  };

  const links = linksByRole[role] || linksByRole['client'];
  sidebar.innerHTML = `
    <nav class="flex flex-col space-y-2">
      ${links.map(link => `
        <a href="${link.href}" class="flex items-center px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
          <i class="${link.icon} mr-3"></i>
          <span>${link.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

document.addEventListener('DOMContentLoaded', renderSidebar); 