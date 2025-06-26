const { validationResult } = require('express-validator');
const Etape = require('../models').Etape;

const getAllEtapes = async (req, res) => {
  try {
    const etapes = await Etape.findAll();
    res.status(200).json(etapes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des étapes' });
  }
};

const getEtapeById = async (req, res) => {
  try {
    const etape = await Etape.findByPk(req.params.id);
    if (!etape) return res.status(404).json({ message: 'Étape non trouvée' });
    res.status(200).json(etape);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l’étape' });
  }
};

const createEtape = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { TempsDebut, TempsFin, Nom, Debut, Fin, Valide, Description } = req.body;

  try {
    const etape = await Etape.create({
      TempsDebut,
      TempsFin,
      Nom,
      Debut,
      Fin,
      Valide,
      Description
    });
    res.status(201).json(etape);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’étape' });
  }
};

const updateEtape = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Etape.update(req.body, {
      where: { IdEtape: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Étape non trouvée' });
    res.status(200).json({ message: 'Étape mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchEtape = async (req, res) => {
  try {
    const [updated] = await Etape.update(req.body, {
      where: { IdEtape: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Étape non trouvée' });
    res.status(200).json({ message: 'Étape mise à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteEtape = async (req, res) => {
  try {
    const deleted = await Etape.destroy({ where: { IdEtape: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Étape non trouvée' });
    res.status(200).json({ message: 'Étape supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l’étape' });
  }
};

module.exports = {
  getAllEtapes,
  getEtapeById,
  createEtape,
  updateEtape,
  patchEtape,
  deleteEtape
};