document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const twofaForm = document.getElementById('twofa-form');
    const twofaError = document.getElementById('twofa-error');
    let loginEmail = '';

    if (!form) {
        console.error('Formulaire non trouvé');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        try {
            // Utilisation du service d'authentification pour la connexion
            const userData = await AuthService.login(email, password);
            // Demande d'envoi du code 2FA
            await fetch('/api/utilisateur/send-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            loginEmail = email;
            form.style.display = 'none';
            twofaForm.style.display = 'block';
        } catch (error) {
            showNotification(error.message || 'Email ou mot de passe incorrect.', 'error');
            if (submitButton) submitButton.disabled = false;
        }
    });

    twofaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('twofa-code').value.trim();
        twofaError.classList.add('hidden');
        try {
            const res = await fetch('/api/utilisateur/verify-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Code invalide');
            // Vérifier les rôles de l'utilisateur
            const userData = await AuthService.getCurrentUser();
            const roles = await RoleService.getUserRoles(userData.user.id);
            showNotification('Connexion réussie !', 'success');
            setTimeout(() => {
                if (roles.length === 1 && roles[0] === 'client') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'role.html';
                }
            }, 1000);
        } catch (error) {
            twofaError.textContent = error.message;
            twofaError.classList.remove('hidden');
        }
    });
});

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-md shadow-lg z-50 transform transition-all duration-300 ease-in-out`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animation d'entrée
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 