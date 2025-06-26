const { validationResult } = require('express-validator');
const LOG = require('../models').LOG;

const getAllLogs = async (req, res) => {
  try {
    const logs = await LOG.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des logs' });
  }
};

const getLogById = async (req, res) => {
  try {
    const log = await LOG.findByPk(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log non trouvé' });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du log' });
  }
};

const createLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    Action,
    DateEvenement,
    IP,
    NavigateurAppareil,
    IdUtilisateur
  } = req.body;

  try {
    const log = await LOG.create({
      Action,
      DateEvenement,
      IP,
      NavigateurAppareil,
      IdUtilisateur
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du log' });
  }
};

const updateLog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await LOG.update(req.body, {
      where: { IdLog: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Log non trouvé' });
    res.status(200).json({ message: 'Log mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du log' });
  }
};

const patchLog = async (req, res) => {
  try {
    const [updated] = await LOG.update(req.body, {
      where: { IdLog: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Log non trouvé' });
    res.status(200).json({ message: 'Log partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle du log' });
  }
};

const deleteLog = async (req, res) => {
  try {
    const deleted = await LOG.destroy({ where: { IdLog: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Log non trouvé' });
    res.status(200).json({ message: 'Log supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du log' });
  }
};

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  patchLog,
  deleteLog
};