const { validationResult } = require('express-validator');
const Tache = require('../models').Tache;

const getAllTaches = async (req, res) => {
  try {
    const taches = await Tache.findAll();
    res.status(200).json(taches);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
  }
};

const getTacheById = async (req, res) => {
  try {
    const tache = await Tache.findByPk(req.params.id);
    if (!tache) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.status(200).json(tache);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
  }
};

const createTache = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    Temps,
    Debut,
    Fin,
    DateJour,
    IdUtilisateur
  } = req.body;

  try {
    const tache = await Tache.create({
      Temps,
      Debut,
      Fin,
      DateJour,
      IdUtilisateur
    });
    res.status(201).json(tache);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
};

const updateTache = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Tache.update(req.body, {
      where: { IdTache: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.status(200).json({ message: 'Tâche mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
  }
};

const patchTache = async (req, res) => {
  try {
    const [updated] = await Tache.update(req.body, {
      where: { IdTache: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.status(200).json({ message: 'Tâche partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteTache = async (req, res) => {
  try {
    const deleted = await Tache.destroy({ where: { IdTache: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.status(200).json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
};

module.exports = {
  getAllTaches,
  getTacheById,
  createTache,
  updateTache,
  patchTache,
  deleteTache
};