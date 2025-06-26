const { validationResult } = require('express-validator');
const Statistiques = require('../models').Statistiques;

const getAllStatistiques = async (req, res) => {
  try {
    const stats = await Statistiques.findAll();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

const getStatistiqueById = async (req, res) => {
  try {
    const stat = await Statistiques.findByPk(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Statistique non trouvée' });
    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la statistique' });
  }
};

const createStatistique = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    TypeStatistique,
    Categorie,
    Valeur,
    TexteOptionnel,
    IdSource,
    SourceType,
    DateCalcul
  } = req.body;

  try {
    const stat = await Statistiques.create({
      TypeStatistique,
      Categorie,
      Valeur,
      TexteOptionnel,
      IdSource,
      SourceType,
      DateCalcul
    });
    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la statistique' });
  }
};

const updateStatistique = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Statistiques.update(req.body, {
      where: { IdStatistique: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Statistique non trouvée' });
    res.status(200).json({ message: 'Statistique mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la statistique' });
  }
};

const patchStatistique = async (req, res) => {
  try {
    const [updated] = await Statistiques.update(req.body, {
      where: { IdStatistique: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Statistique non trouvée' });
    res.status(200).json({ message: 'Statistique partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteStatistique = async (req, res) => {
  try {
    const deleted = await Statistiques.destroy({ where: { IdStatistique: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Statistique non trouvée' });
    res.status(200).json({ message: 'Statistique supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllStatistiques,
  getStatistiqueById,
  createStatistique,
  updateStatistique,
  patchStatistique,
  deleteStatistique
};