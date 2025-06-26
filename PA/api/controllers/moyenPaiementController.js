const { validationResult } = require('express-validator');
const MoyenPaiement = require('../models').MoyenPaiement;

const getAllMoyensPaiement = async (req, res) => {
  try {
    const moyens = await MoyenPaiement.findAll();
    res.status(200).json(moyens);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des moyens de paiement' });
  }
};

const getMoyenPaiementById = async (req, res) => {
  try {
    const moyen = await MoyenPaiement.findByPk(req.params.id);
    if (!moyen) return res.status(404).json({ message: 'Moyen de paiement non trouvé' });
    res.status(200).json(moyen);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du moyen de paiement' });
  }
};

const createMoyenPaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    IdUtilisateur,
    TypePaiement,
    Informations,
    ParDefaut,
    DateAjout
  } = req.body;

  try {
    const moyen = await MoyenPaiement.create({
      IdUtilisateur,
      TypePaiement,
      Informations,
      ParDefaut,
      DateAjout
    });
    res.status(201).json(moyen);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du moyen de paiement' });
  }
};

const updateMoyenPaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await MoyenPaiement.update(req.body, {
      where: { IdMoyenPaiement: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Moyen de paiement non trouvé' });
    res.status(200).json({ message: 'Moyen de paiement mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchMoyenPaiement = async (req, res) => {
  try {
    const [updated] = await MoyenPaiement.update(req.body, {
      where: { IdMoyenPaiement: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Moyen de paiement non trouvé' });
    res.status(200).json({ message: 'Moyen de paiement partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteMoyenPaiement = async (req, res) => {
  try {
    const deleted = await MoyenPaiement.destroy({ where: { IdMoyenPaiement: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Moyen de paiement non trouvé' });
    res.status(200).json({ message: 'Moyen de paiement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllMoyensPaiement,
  getMoyenPaiementById,
  createMoyenPaiement,
  updateMoyenPaiement,
  patchMoyenPaiement,
  deleteMoyenPaiement
};