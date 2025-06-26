const { validationResult } = require('express-validator');
const Recoit = require('../models').Recoit;

const getAllRecoit = async (req, res) => {
  try {
    const data = await Recoit.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des liaisons Recoit' });
  }
};

const getRecoitByIds = async (req, res) => {
  const { IdNotification, IdUtilisateur } = req.params;
  try {
    const recoit = await Recoit.findOne({
      where: { IdNotification, IdUtilisateur }
    });

    if (!recoit) return res.status(404).json({ message: 'Association non trouvée' });
    res.status(200).json(recoit);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la liaison' });
  }
};

const createRecoit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { IdNotification, IdUtilisateur } = req.body;

  try {
    const recoit = await Recoit.create({ IdNotification, IdUtilisateur });
    res.status(201).json(recoit);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la liaison' });
  }
};

const deleteRecoit = async (req, res) => {
  const { IdNotification, IdUtilisateur } = req.params;

  try {
    const deleted = await Recoit.destroy({
      where: { IdNotification, IdUtilisateur }
    });

    if (!deleted) return res.status(404).json({ message: 'Association non trouvée' });
    res.status(200).json({ message: 'Association supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllRecoit,
  getRecoitByIds,
  createRecoit,
  deleteRecoit
};