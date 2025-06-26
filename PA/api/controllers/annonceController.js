const { validationResult } = require('express-validator');
const Annonce = require('../models').Annonce;
const { sendNotificationMail } = require('./notificationController');
const Utilisateur = require('../models').Utilisateur;
const { sendMail } = require('../utils/mailer');

const getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.findAll({
      where: { Statut: 'publiee' },
      include: [
        {
          model: Utilisateur,
          as: 'createur',
          attributes: ['Nom', 'Prenom']
        }
      ]
    });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
  }
};

const getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findByPk(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json(annonce);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'annonce' });
  }
};

const createAnnonce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    Description,
    Type,
    IdTache,
    Temps,
    Prix,
    Debut,
    Fin,
    Pays,
    Titre,
    Statut,
    Adresse,
    DateSouhaitee,
    LienImage,
    IdCreateur
  } = req.body;

  try {
    const annonce = await Annonce.create({
      Description,
      Type,
      IdTache,
      Temps,
      Prix,
      Debut,
      Fin,
      Pays,
      Titre,
      Statut,
      Adresse,
      DateSouhaitee,
      LienImage,
      IdCreateur
    });
    // Envoi mail confirmation
    if (IdCreateur) {
      const user = await Utilisateur.findByPk(IdCreateur);
      if (user) {
        await sendMail({
          to: user.Mail,
          subject: 'Annonce créée sur EcoDeli',
          html: `<p>Votre annonce a bien été créée et est en ligne sur EcoDeli.</p>`
        });
      }
    }
    res.status(201).json(annonce);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'annonce' });
  }
};

const updateAnnonce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Annonce.update(req.body, {
      where: { IdAnnonce: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json({ message: 'Annonce mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'annonce' });
  }
};

const patchAnnonce = async (req, res) => {
  try {
    const [updated] = await Annonce.update(req.body, {
      where: { IdAnnonce: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json({ message: 'Annonce partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteAnnonce = async (req, res) => {
  try {
    const deleted = await Annonce.destroy({ where: { IdAnnonce: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json({ message: 'Annonce supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'annonce' });
  }
};

const reserverAnnonce = async (req, res) => {
  // ... logique de réservation ...
  // Supposons que l'utilisateur est req.user ou req.body.userId
  const userId = req.user?.id || req.body.userId;
  if (userId) {
    const user = await Utilisateur.findByPk(userId);
    if (user) {
      sendNotificationMail({
        body: {
          to: user.Email,
          subject: 'Confirmation de réservation EcoDeli',
          html: `<p>Votre réservation d'annonce a bien été prise en compte.</p>`
        }
      }, { json: () => {} });
    }
  }
  // ... suite de la logique ...
};

module.exports = {
  getAllAnnonces,
  getAnnonceById,
  createAnnonce,
  updateAnnonce,
  patchAnnonce,
  deleteAnnonce,
  reserverAnnonce
};