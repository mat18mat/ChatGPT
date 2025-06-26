const { validationResult } = require('express-validator');
const Abonnement = require('../models').Abonnement;
const { sendNotificationMail } = require('./notificationController');
const Utilisateur = require('../models').Utilisateur;

const getAllAbonnements = async (req, res) => {
  try {
    const abonnements = await Abonnement.findAll();
    res.status(200).json(abonnements);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des abonnements' });
  }
};

const getAbonnementById = async (req, res) => {
  try {
    const abonnement = await Abonnement.findByPk(req.params.id);
    if (!abonnement) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.status(200).json(abonnement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'abonnement' });
  }
};

const createAbonnement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    IdUtilisateur,
    Nom,
    PrixMensuel,
    Assurance,
    Reduction,
    LivraisonPrioritaire,
    ColisOfferts,
    Avantages,
    Recurence,
    DateDebut,
    DateFin
  } = req.body;

  try {
    const abonnement = await Abonnement.create({
      IdUtilisateur,
      Nom,
      PrixMensuel,
      Assurance,
      Reduction,
      LivraisonPrioritaire,
      ColisOfferts,
      Avantages,
      Recurence,
      DateDebut,
      DateFin
    });
    res.status(201).json(abonnement);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'abonnement' });

  }
};

const updateAbonnement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Abonnement.update(req.body, {
      where: { IdAbonnement: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.status(200).json({ message: 'Abonnement mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchAbonnement = async (req, res) => {
  try {
    const [updated] = await Abonnement.update(req.body, {
      where: { IdAbonnement: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.status(200).json({ message: 'Abonnement mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteAbonnement = async (req, res) => {
  try {
    const deleted = await Abonnement.destroy({ where: { IdAbonnement: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Abonnement non trouvé' });
    res.status(200).json({ message: 'Abonnement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

async function souscrireAbonnement(req, res) {
  // ... logique de souscription ...
  const userId = req.user?.id || req.body.userId;
  if (userId) {
    const user = await Utilisateur.findByPk(userId);
    if (user) {
      sendNotificationMail({
        body: {
          to: user.Email,
          subject: 'Confirmation de souscription à un abonnement EcoDeli',
          html: `<p>Votre abonnement a bien été activé. Merci pour votre confiance !</p>`
        }
      }, { json: () => {} });
    }
  }
  // ... suite de la logique ...
}

async function renouvelerAbonnement(req, res) {
  // ... logique de renouvellement ...
  const userId = req.user?.id || req.body.userId;
  if (userId) {
    const user = await Utilisateur.findByPk(userId);
    if (user) {
      sendNotificationMail({
        body: {
          to: user.Email,
          subject: 'Renouvellement de votre abonnement EcoDeli',
          html: `<p>Votre abonnement a bien été renouvelé.</p>`
        }
      }, { json: () => {} });
    }
  }
  // ... suite de la logique ...
}

module.exports = {
  getAllAbonnements,
  getAbonnementById,
  createAbonnement,
  updateAbonnement,
  patchAbonnement,
  deleteAbonnement,
  souscrireAbonnement,
  renouvelerAbonnement
};