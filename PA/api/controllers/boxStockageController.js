const { validationResult } = require('express-validator');
const BoxStockage = require('../models').BoxStockage;
const { sendNotificationMail } = require('./notificationController');
const Utilisateur = require('../models').Utilisateur;

const getAllBoxStockage = async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) {
      where.IdUtilisateur = req.query.userId;
    }
    const boxes = await BoxStockage.findAll({ where });
    res.status(200).json(boxes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des box de stockage' });
  }
};

const getBoxStockageById = async (req, res) => {
  try {
    const box = await BoxStockage.findByPk(req.params.id);
    if (!box) return res.status(404).json({ message: 'Box non trouvé' });
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du box' });
  }
};

const createBoxStockage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    IdUtilisateur,
    IdEntrepot,
    DateDebut,
    DateFin,
    Taille,
    TypeBox,
    Statut,
    Assurance,
    Description
  } = req.body;

  try {
    const box = await BoxStockage.create({
      IdUtilisateur,
      IdEntrepot,
      DateDebut,
      DateFin,
      Taille,
      TypeBox,
      Statut,
      Assurance,
      Description
    });
    res.status(201).json(box);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du box' });
  }
};

const updateBoxStockage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await BoxStockage.update(req.body, {
      where: { IdBox: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Box non trouvé' });
    res.status(200).json({ message: 'Box mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du box' });
  }
};

const patchBoxStockage = async (req, res) => {
  try {
    const [updated] = await BoxStockage.update(req.body, {
      where: { IdBox: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Box non trouvé' });
    res.status(200).json({ message: 'Box partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteBoxStockage = async (req, res) => {
  try {
    const deleted = await BoxStockage.destroy({ where: { IdBox: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Box non trouvé' });
    res.status(200).json({ message: 'Box supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du box' });
  }
};

async function reserverBox(req, res) {
  // ... logique de réservation ...
  const userId = req.user?.id || req.body.userId;
  if (userId) {
    const user = await Utilisateur.findByPk(userId);
    if (user) {
      sendNotificationMail({
        body: {
          to: user.Email,
          subject: 'Confirmation de réservation de box EcoDeli',
          html: `<p>Votre réservation de box a bien été prise en compte.</p>`
        }
      }, { json: () => {} });
    }
  }
  // ... suite de la logique ...
}

async function libererBox(req, res) {
  // ... logique de libération ...
  const userId = req.user?.id || req.body.userId;
  if (userId) {
    const user = await Utilisateur.findByPk(userId);
    if (user) {
      sendNotificationMail({
        body: {
          to: user.Email,
          subject: 'Confirmation de libération de box EcoDeli',
          html: `<p>Votre box a bien été libérée.</p>`
        }
      }, { json: () => {} });
    }
  }
  // ... suite de la logique ...
}

async function partagerAccesBox(req, res) {
  // ... logique de partage ...
  const destinataireEmail = req.body.destinataireEmail;
  if (destinataireEmail) {
    sendNotificationMail({
      body: {
        to: destinataireEmail,
        subject: 'Accès à une box EcoDeli',
        html: `<p>Vous avez reçu un accès à une box de stockage sur EcoDeli.</p>`
      }
    }, { json: () => {} });
  }
  // ... suite de la logique ...
}

module.exports = {
  getAllBoxStockage,
  getBoxStockageById,
  createBoxStockage,
  updateBoxStockage,
  patchBoxStockage,
  deleteBoxStockage,
  reserverBox,
  libererBox,
  partagerAccesBox
};