document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    if (!form) {
        console.error('Formulaire non trouvé');
        return;
    }

    let verificationStep = false;
    let lastUserEmail = '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Désactiver le bouton de soumission pour éviter les doubles soumissions
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }

        // Gestion de la double authentification (étape code)
        if (verificationStep) {
            const code = document.getElementById('verification-code').value.trim();
            if (!code) {
                showNotification('Veuillez saisir le code reçu par mail.', 'error');
                if (submitButton) submitButton.disabled = false;
                return;
            }
            try {
                await verifyEmailCode(lastUserEmail, code);
                showNotification('Inscription validée ! Redirection...', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
            } catch (err) {
                showNotification(err.message || 'Code invalide.', 'error');
                if (submitButton) submitButton.disabled = false;
            }
            return;
        }

        // Récupération des données du formulaire
        const formData = new FormData(form);
        // Ajout des fichiers justificatifs
        const pieceIdentite = document.getElementById('piece-identite').files[0];
        const justificatifDomicile = document.getElementById('justificatif-domicile').files[0];
        if (pieceIdentite) formData.append('pieceIdentite', pieceIdentite);
        if (justificatifDomicile) formData.append('justificatifDomicile', justificatifDomicile);

        // Ajout des rôles supplémentaires (si déjà validé, à gérer côté backend)
        // Ici, on envoie tous les rôles sélectionnés
        const roles = Array.from(form.querySelectorAll('input[name="roles"]:checked')).map(cb => cb.value);
        formData.set('roles', JSON.stringify(roles));

        try {
            // Appel API d'inscription (FormData pour fichiers)
            const res = await fetch('/api/utilisateurs/register', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur lors de l\'inscription');

            // Stocker l'email pour la vérification
            lastUserEmail = formData.get('email');
            verificationStep = true;
            showVerificationStep();
            showNotification('Un code de vérification a été envoyé par mail.', 'success');
        } catch (error) {
            console.error('Erreur:', error);
            showNotification(error.message || 'Une erreur est survenue lors de l\'inscription.', 'error');
            
            // Réactiver le bouton de soumission en cas d'erreur
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });

    // Gestion du bouton "Renvoyer le code"
    document.body.addEventListener('click', async (e) => {
        if (e.target && e.target.id === 'resend-code') {
            try {
                await resendVerificationCode(lastUserEmail);
                showNotification('Code renvoyé par mail.', 'success');
            } catch (err) {
                showNotification('Erreur lors de l\'envoi du code.', 'error');
            }
        }
    });

    // Validation en temps réel des champs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
});

// Affiche l'étape de vérification du code
function showVerificationStep() {
    const form = document.querySelector('form');
    form.innerHTML = `
        <div class="mb-6 text-center">
            <h3 class="text-xl font-bold mb-2">Vérification de l'email</h3>
            <p class="text-gray-600 mb-4">Un code de vérification a été envoyé à votre adresse mail. Veuillez le saisir ci-dessous pour activer votre compte.</p>
        </div>
        <div class="mb-4">
            <label for="verification-code" class="block font-medium mb-2">Code de vérification</label>
            <input type="text" id="verification-code" class="form-control w-full border border-gray-200 rounded-xl px-4 py-3" required>
        </div>
        <button type="submit" class="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-colors font-medium">Valider</button>
        <div class="mt-4 text-center">
            <button type="button" id="resend-code" class="text-primary hover:underline">Renvoyer le code</button>
        </div>
    `;
}

// Appel API pour vérifier le code reçu par mail
async function verifyEmailCode(email, code) {
    const res = await fetch('/api/utilisateurs/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Code invalide');
    }
    return true;
}

// Appel API pour renvoyer le code
async function resendVerificationCode(email) {
    const res = await fetch('/api/utilisateurs/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Erreur lors de l\'envoi du code');
    return true;
}

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

// Fonction de validation des champs
function setFieldError(input, message) {
    input.classList.add('border-red-500');
    input.classList.remove('border-green-500');
    const errorDiv = document.getElementById('error-' + input.id);
    if (errorDiv) errorDiv.textContent = message;
}
function setFieldValid(input) {
    input.classList.remove('border-red-500');
    input.classList.add('border-green-500');
    const errorDiv = document.getElementById('error-' + input.id);
    if (errorDiv) errorDiv.textContent = '';
}
function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    switch(input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMessage = 'Email invalide';
            break;
        case 'password':
            isValid = value.length >= 8;
            errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
            break;
        case 'tel':
            const phoneRegex = /^[0-9+\s-]{10,}$/;
            isValid = phoneRegex.test(value);
            errorMessage = 'Numéro de téléphone invalide';
            break;
        default:
            if (input.required) {
                isValid = value.length > 0;
                errorMessage = 'Ce champ est requis';
            }
    }
    if (input.id === 'confirm-password') {
        const pwd = document.getElementById('password').value;
        isValid = value === pwd && value.length >= 8;
        errorMessage = 'Les mots de passe ne correspondent pas';
    }
    if (!isValid) {
        setFieldError(input, errorMessage);
    } else {
        setFieldValid(input);
    }
    return isValid;
}
// Validation de tous les champs de l'étape 1 avant de passer à l'étape suivante
function validateStep1() {
    const requiredFields = [
        'nom', 'prenom', 'email', 'telephone', 'password', 'confirm-password', 'adresse', 'code-postal', 'ville', 'pays'
    ];
    let allValid = true;
    requiredFields.forEach(id => {
        const input = document.getElementById(id);
        if (input && !validateField(input)) allValid = false;
    });
    return allValid;
}
// Empêche le passage à l'étape suivante si erreurs
const nextStep1Btn = document.getElementById('next-step-1');
if (nextStep1Btn) {
    nextStep1Btn.addEventListener('click', (e) => {
        if (!validateStep1()) {
            e.preventDefault();
            showNotification('Veuillez corriger les erreurs du formulaire.', 'error');
        }
    });
} 