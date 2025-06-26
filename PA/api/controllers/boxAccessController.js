const { validationResult } = require('express-validator');
const BoxAccess = require('../models').BoxAccess;

const getAllBoxAccess = async (req, res) => {
  try {
    const accesses = await BoxAccess.findAll();
    res.status(200).json(accesses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des accès' });
  }
};

const getBoxAccessById = async (req, res) => {
  try {
    const access = await BoxAccess.findByPk(req.params.id);
    if (!access) return res.status(404).json({ message: 'Accès non trouvé' });
    res.status(200).json(access);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l’accès' });
  }
};

const createBoxAccess = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { IdBox, EmailInvite, TypeAcces } = req.body;

  try {
    const access = await BoxAccess.create({ IdBox, EmailInvite, TypeAcces });
    res.status(201).json(access);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’accès' });
  }
};

const updateBoxAccess = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await BoxAccess.update(req.body, {
      where: { IdAccess: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Accès non trouvé' });
    res.status(200).json({ message: 'Accès mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’accès' });
  }
};

const patchBoxAccess = async (req, res) => {
  try {
    const [updated] = await BoxAccess.update(req.body, {
      where: { IdAccess: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Accès non trouvé' });
    res.status(200).json({ message: 'Accès partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteBoxAccess = async (req, res) => {
  try {
    const deleted = await BoxAccess.destroy({ where: { IdAccess: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Accès non trouvé' });
    res.status(200).json({ message: 'Accès supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l’accès' });
  }
};

module.exports = {
  getAllBoxAccess,
  getBoxAccessById,
  createBoxAccess,
  updateBoxAccess,
  patchBoxAccess,
  deleteBoxAccess
};