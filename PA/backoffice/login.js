// backoffice/login.js

const loginForm = document.getElementById('login-form');
const twofaForm = document.getElementById('twofa-form');
const errorMsg = document.getElementById('error-msg');
const twofaError = document.getElementById('twofa-error');
let loginEmail = '';

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  errorMsg.style.display = 'none';

  try {
    // Appel API d'authentification admin (à adapter selon ton endpoint)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Identifiants invalides');
    // Stocke le token et le rôle admin temporairement (pas de redirection tout de suite)
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminRole', 'admin');
    loginEmail = email;
    // Demande d'envoi du code 2FA
    await fetch('/api/utilisateur/send-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    loginForm.style.display = 'none';
    twofaForm.style.display = 'block';
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.style.display = 'block';
  }
});

twofaForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const code = document.getElementById('twofa-code').value.trim();
  twofaError.style.display = 'none';
  try {
    const res = await fetch('/api/utilisateur/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Code invalide');
    // Redirige vers le dashboard backoffice
    window.location.href = 'index.html';
  } catch (err) {
    twofaError.textContent = err.message;
    twofaError.style.display = 'block';
  }
});

document.getElementById('forgot-link').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Un lien de réinitialisation ou un code va être envoyé par mail (fonctionnalité à implémenter côté serveur).');
}); 