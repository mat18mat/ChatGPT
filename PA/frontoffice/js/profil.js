// frontoffice/js/profil.js

// Sécurisation et récupération de l'utilisateur courant
if (!AuthService.isAuthenticated()) {
  window.location.href = 'login.html';
}

const currentUser = AuthService.getCurrentUser();
const token = localStorage.getItem('token');

async function chargerProfil() {
  try {
    const res = await fetch(`/api/utilisateur/${currentUser.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      document.getElementById('nom').value = data.Nom || '';
      document.getElementById('prenom').value = data.Prenom || '';
      document.getElementById('mail').value = data.Mail || '';
      document.getElementById('telephone').value = data.Telephone || '';
      document.getElementById('adresse').value = data.Adresse || '';
    }
  } catch (err) {
    document.getElementById('profil-message').textContent = "Erreur lors du chargement du profil.";
  }
}

document.getElementById('profil-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const body = {
    Nom: document.getElementById('nom').value,
    Prenom: document.getElementById('prenom').value,
    Mail: document.getElementById('mail').value,
    Telephone: document.getElementById('telephone').value,
    Adresse: document.getElementById('adresse').value
  };
  // Gestion du mot de passe si modifié
  const newPassword = document.getElementById('new-password')?.value;
  if (newPassword) {
    body.MotDePasse = newPassword;
  }
  try {
    const res = await fetch(`/api/utilisateur/${currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      document.getElementById('profil-message').textContent = "Profil mis à jour !";
      document.getElementById('new-password').value = '';
    } else {
      document.getElementById('profil-message').textContent = "Erreur lors de la mise à jour.";
    }
  } catch (err) {
    document.getElementById('profil-message').textContent = "Erreur lors de la mise à jour.";
  }
});

// Affichage/masquage du champ mot de passe
const passwordToggle = document.getElementById('toggle-password');
if (passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const pwdField = document.getElementById('password-field');
    if (pwdField.classList.contains('hidden')) {
      pwdField.classList.remove('hidden');
    } else {
      pwdField.classList.add('hidden');
      document.getElementById('new-password').value = '';
    }
  });
}

// Déconnexion
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    AuthService.logout();
    window.location.href = 'login.html';
  });
}

chargerProfil();