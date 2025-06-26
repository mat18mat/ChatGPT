const { validationResult } = require('express-validator');
const Prestataire = require('../models').Prestataire;

const getAllPrestataires = async (req, res) => {
  try {
    const prestataires = await Prestataire.findAll();
    res.status(200).json(prestataires);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des prestataires' });
  }
};

const getPrestataireById = async (req, res) => {
  try {
    const prestataire = await Prestataire.findByPk(req.params.id);
    if (!prestataire) return res.status(404).json({ message: 'Prestataire non trouvé' });
    res.status(200).json(prestataire);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du prestataire' });
  }
};

const createPrestataire = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    OptionGrossiste,
    Habilitations,
    Tarifs,
    Approuve,
    Actif,
    IdAnnonce,
    IdContrat
  } = req.body;

  try {
    const prestataire = await Prestataire.create({
      OptionGrossiste,
      Habilitations,
      Tarifs,
      Approuve,
      Actif,
      IdAnnonce,
      IdContrat
    });
    res.status(201).json(prestataire);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du prestataire' });
  }
};

const updatePrestataire = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Prestataire.update(req.body, {
      where: { IdPrestataire: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Prestataire non trouvé' });
    res.status(200).json({ message: 'Prestataire mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchPrestataire = async (req, res) => {
  try {
    const [updated] = await Prestataire.update(req.body, {
      where: { IdPrestataire: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Prestataire non trouvé' });
    res.status(200).json({ message: 'Prestataire mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deletePrestataire = async (req, res) => {
  try {
    const deleted = await Prestataire.destroy({ where: { IdPrestataire: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Prestataire non trouvé' });
    res.status(200).json({ message: 'Prestataire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllPrestataires,
  getPrestataireById,
  createPrestataire,
  updatePrestataire,
  patchPrestataire,
  deletePrestataire
};