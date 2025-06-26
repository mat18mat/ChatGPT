const { validationResult } = require('express-validator');
const Evaluation = require('../models').Evaluation;

const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll();
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des évaluations' });
  }
};

const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Évaluation non trouvée' });
    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l’évaluation' });
  }
};

const createEvaluation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    Note,
    Commentaire,
    Date,
    TypeDestinataire,
    IdCible,
    IdEvalueur
  } = req.body;

  try {
    const evaluation = await Evaluation.create({
      Note,
      Commentaire,
      Date,
      TypeDestinataire,
      IdCible,
      IdEvalueur
    });
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’évaluation' });
  }
};

const updateEvaluation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Evaluation.update(req.body, {
      where: { IdEvaluation: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Évaluation non trouvée' });
    res.status(200).json({ message: 'Évaluation mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchEvaluation = async (req, res) => {
  try {
    const [updated] = await Evaluation.update(req.body, {
      where: { IdEvaluation: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Évaluation non trouvée' });
    res.status(200).json({ message: 'Évaluation partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteEvaluation = async (req, res) => {
  try {
    const deleted = await Evaluation.destroy({ where: { IdEvaluation: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Évaluation non trouvée' });
    res.status(200).json({ message: 'Évaluation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  patchEvaluation,
  deleteEvaluation
};