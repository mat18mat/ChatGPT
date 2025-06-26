const { validationResult } = require('express-validator');
const MediaAnnonce = require('../models').MediaAnnonce;

const getAllMedia = async (req, res) => {
  try {
    const media = await MediaAnnonce.findAll();
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des médias' });
  }
};

const getMediaById = async (req, res) => {
  try {
    const media = await MediaAnnonce.findByPk(req.params.id);
    if (!media) return res.status(404).json({ message: 'Média non trouvé' });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du média' });
  }
};

const createMedia = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdAnnonce, LienMedia } = req.body;

  try {
    const media = await MediaAnnonce.create({ IdAnnonce, LienMedia });
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du média' });
  }
};

const updateMedia = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await MediaAnnonce.update(req.body, {
      where: { IdMedia: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Média non trouvé' });
    res.status(200).json({ message: 'Média mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du média' });
  }
};

const patchMedia = async (req, res) => {
  try {
    const [updated] = await MediaAnnonce.update(req.body, {
      where: { IdMedia: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Média non trouvé' });
    res.status(200).json({ message: 'Média partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const deleted = await MediaAnnonce.destroy({
      where: { IdMedia: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Média non trouvé' });
    res.status(200).json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du média' });
  }
};

module.exports = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  patchMedia,
  deleteMedia
};