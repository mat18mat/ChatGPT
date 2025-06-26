const { validationResult } = require('express-validator');
const Paiement = require('../models').Paiement;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendNotificationMail } = require('./notificationController');
const Abonnement = require('../models').Abonnement;
const Utilisateur = require('../models').Utilisateur;

const getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.findAll();
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des paiements' });
  }
};

const getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du paiement' });
  }
};

const createPaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    IdUtilisateur,
    Montant,
    TypePaiement,
    DatePaiement,
    Statut,
    IdFacture,
    IdMoyenPaiement
  } = req.body;

  try {
    const paiement = await Paiement.create({
      IdUtilisateur,
      Montant,
      TypePaiement,
      DatePaiement,
      Statut,
      IdFacture,
      IdMoyenPaiement
    });
    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du paiement' });
  }
};

const updatePaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Paiement.update(req.body, {
      where: { IdPaiement: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.status(200).json({ message: 'Paiement mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchPaiement = async (req, res) => {
  try {
    const [updated] = await Paiement.update(req.body, {
      where: { IdPaiement: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.status(200).json({ message: 'Paiement mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deletePaiement = async (req, res) => {
  try {
    const deleted = await Paiement.destroy({ where: { IdPaiement: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.status(200).json({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

const createStripeSession = async (req, res) => {
  const { amount, currency = 'eur', successUrl, cancelUrl, description, userId } = req.body;
  try {
    // Vérifier si l'utilisateur a un abonnement actif
    let finalAmount = amount;
    if (userId) {
      const abonnement = await Abonnement.findOne({ where: { IdUtilisateur: userId, Actif: true } });
      if (abonnement) {
        // Exemple : 10% de remise si abonnement actif
        finalAmount = Math.round(amount * 0.9);
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description || 'Paiement EcoDeli' },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    // Envoi d'un mail de confirmation de paiement (asynchrone)
    if (userId) {
      const user = await Utilisateur.findByPk(userId);
      if (user) {
        sendNotificationMail({
          body: {
            to: user.Email,
            subject: 'Confirmation de paiement EcoDeli',
            html: `<p>Votre paiement a bien été pris en compte. Merci pour votre confiance !</p>`
          }
        }, { json: () => {} });
      }
    }
    res.json({ id: session.id, url: session.url });
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe' });
  }
};

const createStripeSubscriptionSession = async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.json({ id: session.id, url: session.url });
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de la création de la session d\'abonnement Stripe' });
  }
};

module.exports = {
  getAllPaiements,
  getPaiementById,
  createPaiement,
  updatePaiement,
  patchPaiement,
  deletePaiement,
  createStripeSession,
  createStripeSubscriptionSession
};