document.addEventListener('DOMContentLoaded', () => {
  const stripePayBtn = document.getElementById('stripe-pay-btn');
  if (!stripePayBtn) return;

  stripePayBtn.addEventListener('click', async () => {
    try {
      // À adapter selon le contexte : montant, description, etc.
      const amount = 1999; // exemple : 19,99€
      const description = 'Paiement EcoDeli';
      const successUrl = window.location.origin + '/paiement-success.html';
      const cancelUrl = window.location.origin + '/paiement-echec.html';
      const res = await fetch('/api/paiement/stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description, successUrl, cancelUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du paiement');
      const stripe = Stripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'); // Remplacer par ta clé publique Stripe
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (e) {
      alert(e.message);
    }
  });
}); 