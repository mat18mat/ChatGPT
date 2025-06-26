const { validationResult } = require('express-validator');
const Colis = require('../models').Colis;

const getAllColis = async (req, res) => {
  try {
    const colis = await Colis.findAll();
    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des colis' });
  }
};

const getColisById = async (req, res) => {
  try {
    const colis = await Colis.findByPk(req.params.id);
    if (!colis) return res.status(404).json({ message: 'Colis non trouvé' });
    res.status(200).json(colis);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du colis' });
  }
};

const createColis = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { Description, Dimensions, IdDestinataire, IdUtilisateur, IdCourse } = req.body;

  try {
    const colis = await Colis.create({
      Description,
      Dimensions,
      IdDestinataire,
      IdUtilisateur,
      IdCourse
    });
    res.status(201).json(colis);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du colis' });
  }
};

const updateColis = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Colis.update(req.body, {
      where: { IdColis: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Colis non trouvé' });
    res.status(200).json({ message: 'Colis mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du colis' });
  }
};

const patchColis = async (req, res) => {
  try {
    const [updated] = await Colis.update(req.body, {
      where: { IdColis: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Colis non trouvé' });
    res.status(200).json({ message: 'Colis partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteColis = async (req, res) => {
  try {
    const deleted = await Colis.destroy({ where: { IdColis: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Colis non trouvé' });
    res.status(200).json({ message: 'Colis supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du colis' });
  }
};

module.exports = {
  getAllColis,
  getColisById,
  createColis,
  updateColis,
  patchColis,
  deleteColis
};