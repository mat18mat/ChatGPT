const { validationResult } = require('express-validator');
const ContientEtape = require('../models').ContientEtape;

const getAll = async (req, res) => {
  try {
    const entries = await ContientEtape.findAll();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des liaisons' });
  }
};

const getOne = async (req, res) => {
  const { idEtape, idCourse } = req.params;
  try {
    const entry = await ContientEtape.findOne({
      where: { IdEtape: idEtape, IdCourse: idCourse }
    });

    if (!entry) return res.status(404).json({ message: 'Liaison non trouvée' });
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la liaison' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdEtape, IdCourse } = req.body;

  try {
    const entry = await ContientEtape.create({ IdEtape, IdCourse });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la liaison' });
  }
};

const deleteOne = async (req, res) => {
  const { idEtape, idCourse } = req.params;
  try {
    const deleted = await ContientEtape.destroy({
      where: { IdEtape: idEtape, IdCourse: idCourse }
    });

    if (!deleted) return res.status(404).json({ message: 'Liaison non trouvée' });
    res.status(200).json({ message: 'Liaison supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la liaison' });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne
};