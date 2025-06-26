const { validationResult } = require('express-validator');
const Commercant = require('../models').Commercant;

const getAllCommercants = async (req, res) => {
  try {
    const commercants = await Commercant.findAll();
    res.status(200).json(commercants);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commerçants' });
  }
};

const getCommercantById = async (req, res) => {
  try {
    const commercant = await Commercant.findByPk(req.params.id);
    if (!commercant) return res.status(404).json({ message: 'Commerçant non trouvé' });
    res.status(200).json(commercant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du commerçant' });
  }
};

const createCommercant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    IdContrat,
    OptionGrossiste,
    HeureOuverture,
    Actif,
    NomCommerce,
    TypeCommerce,
    SIRET,
    IdEntrepot,
    IdUtilisateur,
    IdCourse
  } = req.body;

  try {
    const commercant = await Commercant.create({
      IdContrat,
      OptionGrossiste,
      HeureOuverture,
      Actif,
      NomCommerce,
      TypeCommerce,
      SIRET,
      IdEntrepot,
      IdUtilisateur,
      IdCourse
    });
    res.status(201).json(commercant);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du commerçant' });
  }
};

const updateCommercant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Commercant.update(req.body, {
      where: { IdCommercant: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Commerçant non trouvé' });
    res.status(200).json({ message: 'Commerçant mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchCommercant = async (req, res) => {
  try {
    const [updated] = await Commercant.update(req.body, {
      where: { IdCommercant: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Commerçant non trouvé' });
    res.status(200).json({ message: 'Commerçant mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteCommercant = async (req, res) => {
  try {
    const deleted = await Commercant.destroy({ where: { IdCommercant: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Commerçant non trouvé' });
    res.status(200).json({ message: 'Commerçant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllCommercants,
  getCommercantById,
  createCommercant,
  updateCommercant,
  patchCommercant,
  deleteCommercant
};