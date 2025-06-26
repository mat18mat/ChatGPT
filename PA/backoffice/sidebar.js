function renderBackofficeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const current = window.location.pathname.split('/').pop();
  const links = [
    { href: 'index.html', label: 'Accueil', icon: 'fas fa-tachometer-alt', color: 'text-blue-600' },
    { href: 'utilisateurs.html', label: 'Utilisateurs', icon: 'fas fa-users', color: 'text-green-600' },
    { href: 'logs.html', label: 'Logs', icon: 'fas fa-clipboard-list', color: 'text-yellow-600' },
    { href: 'livraisons.html', label: 'Livraisons', icon: 'fas fa-truck', color: 'text-purple-600' },
    { href: 'boxes.html', label: 'Box Stockage', icon: 'fas fa-box', color: 'text-pink-600' },
    { href: 'annonces.html', label: 'Annonces', icon: 'fas fa-bullhorn', color: 'text-red-600' }
  ];

  sidebar.innerHTML = `
    <nav class="flex flex-col space-y-2 p-4 bg-gradient-to-b from-blue-50 to-white min-h-screen shadow-lg">
      <div class="mb-6 text-xl font-bold text-blue-700 flex items-center gap-2"><i class="fas fa-leaf text-green-500"></i> EcoDeli Admin</div>
      ${links.map(link => `
        <a href="${link.href}" class="flex items-center px-4 py-2 rounded-lg font-medium transition-colors gap-3 group ${current === link.href ? 'bg-blue-200/80 text-blue-900 shadow' : 'hover:bg-blue-100'}">
          <i class="${link.icon} ${link.color} text-lg group-hover:scale-110 transition-transform"></i>
          <span>${link.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

document.addEventListener('DOMContentLoaded', renderBackofficeSidebar); 