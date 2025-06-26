const { validationResult } = require('express-validator');
const Entrepot = require('../models').Entrepot;

const getAllEntrepots = async (req, res) => {
  try {
    const entrepots = await Entrepot.findAll();
    res.status(200).json(entrepots);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des entrepôts' });
  }
};

const getEntrepotById = async (req, res) => {
  try {
    const entrepot = await Entrepot.findByPk(req.params.id);
    if (!entrepot) return res.status(404).json({ message: 'Entrepôt non trouvé' });
    res.status(200).json(entrepot);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entrepôt' });
  }
};

const createEntrepot = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { Localisation, Secteur, Capacite } = req.body;

  try {
    const entrepot = await Entrepot.create({ Localisation, Secteur, Capacite });
    res.status(201).json(entrepot);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'entrepôt' });
  }
};

const updateEntrepot = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Entrepot.update(req.body, {
      where: { IdEntrepot: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Entrepôt non trouvé' });
    res.status(200).json({ message: 'Entrepôt mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchEntrepot = async (req, res) => {
  try {
    const [updated] = await Entrepot.update(req.body, {
      where: { IdEntrepot: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Entrepôt non trouvé' });
    res.status(200).json({ message: 'Entrepôt mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteEntrepot = async (req, res) => {
  try {
    const deleted = await Entrepot.destroy({ where: { IdEntrepot: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Entrepôt non trouvé' });
    res.status(200).json({ message: 'Entrepôt supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllEntrepots,
  getEntrepotById,
  createEntrepot,
  updateEntrepot,
  patchEntrepot,
  deleteEntrepot
};