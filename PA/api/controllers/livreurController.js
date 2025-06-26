const { validationResult } = require('express-validator');
const Livreurs = require('../models').Livreurs;

const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await Livreurs.findAll();
    res.status(200).json(livreurs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livreurs' });
  }
};

const getLivreurById = async (req, res) => {
  try {
    const livreur = await Livreurs.findByPk(req.params.id);
    if (!livreur) return res.status(404).json({ message: 'Livreur non trouvé' });
    res.status(200).json(livreur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du livreur' });
  }
};

const createLivreur = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    OptionGrossiste,
    Vehicule,
    Actif,
    IdUtilisateur,
    IdContrat
  } = req.body;

  try {
    const livreur = await Livreurs.create({
      OptionGrossiste,
      Vehicule,
      Actif,
      IdUtilisateur,
      IdContrat
    });
    res.status(201).json(livreur);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du livreur' });
  }
};

const updateLivreur = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Livreurs.update(req.body, {
      where: { IdLivreur: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Livreur non trouvé' });
    res.status(200).json({ message: 'Livreur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du livreur' });
  }
};

const patchLivreur = async (req, res) => {
  try {
    const [updated] = await Livreurs.update(req.body, {
      where: { IdLivreur: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Livreur non trouvé' });
    res.status(200).json({ message: 'Livreur partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle du livreur' });
  }
};

const deleteLivreur = async (req, res) => {
  try {
    const deleted = await Livreurs.destroy({ where: { IdLivreur: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Livreur non trouvé' });
    res.status(200).json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du livreur' });
  }
};

module.exports = {
  getAllLivreurs,
  getLivreurById,
  createLivreur,
  updateLivreur,
  patchLivreur,
  deleteLivreur
};