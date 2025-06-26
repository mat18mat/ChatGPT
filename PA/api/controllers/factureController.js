const { validationResult } = require('express-validator');
const Facture = require('../models').Facture;
const { sendMail } = require('../utils/mailer');
const Utilisateur = require('../models').Utilisateur;
const fs = require('fs');

const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.findAll();
    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
};

const getFactureById = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);
    if (!facture) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json(facture);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
  }
};

const createFacture = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    MontantTotal,
    DateCreation,
    LienPDF,
    IdUtilisateur,
    IdAbonnement
  } = req.body;

  try {
    const facture = await Facture.create({
      MontantTotal,
      DateCreation,
      LienPDF,
      IdUtilisateur,
      IdAbonnement
    });
    // Envoi du PDF par mail si possible
    if (IdUtilisateur && LienPDF) {
      const user = await Utilisateur.findByPk(IdUtilisateur);
      if (user) {
        let attachment = undefined;
        try {
          attachment = [{ filename: 'facture.pdf', path: LienPDF }];
        } catch (e) {}
        await sendMail({
          to: user.Mail,
          subject: 'Votre facture EcoDeli',
          html: `<p>Veuillez trouver votre facture en pièce jointe.</p>`,
          attachments: attachment
        });
      }
    }
    res.status(201).json(facture);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture' });
  }
};

const updateFacture = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Facture.update(req.body, {
      where: { IdFacture: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json({ message: 'Facture mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la facture' });
  }
};

const patchFacture = async (req, res) => {
  try {
    const [updated] = await Facture.update(req.body, {
      where: { IdFacture: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json({ message: 'Facture partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteFacture = async (req, res) => {
  try {
    const deleted = await Facture.destroy({
      where: { IdFacture: req.params.id }
    });

    if (!deleted) return res.status(404).json({ message: 'Facture non trouvée' });
    res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
  }
};

module.exports = {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  patchFacture,
  deleteFacture
};