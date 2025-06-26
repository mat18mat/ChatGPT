const { validationResult } = require('express-validator');
const EffectuePar = require('../models').EffectuePar;

const getAll = async (req, res) => {
  try {
    const entries = await EffectuePar.findAll();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations' });
  }
};

const getOne = async (req, res) => {
  const { idLivreur, idCourse } = req.params;
  try {
    const entry = await EffectuePar.findOne({
      where: { IdLivreur: idLivreur, IdCourse: idCourse }
    });

    if (!entry) return res.status(404).json({ message: 'Relation non trouvée' });
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdLivreur, IdCourse } = req.body;

  try {
    const relation = await EffectuePar.create({ IdLivreur, IdCourse });
    res.status(201).json(relation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la relation' });
  }
};

const deleteOne = async (req, res) => {
  const { idLivreur, idCourse } = req.params;
  try {
    const deleted = await EffectuePar.destroy({
      where: { IdLivreur: idLivreur, IdCourse: idCourse }
    });

    if (!deleted) return res.status(404).json({ message: 'Relation non trouvée' });
    res.status(200).json({ message: 'Relation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation' });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne
};