const { validationResult } = require('express-validator');
const ZoneTravail = require('../models').ZoneTravail;

const getAllZonesTravail = async (req, res) => {
  try {
    const zones = await ZoneTravail.findAll();
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des zones de travail' });
  }
};

const getZoneTravailById = async (req, res) => {
  try {
    const zone = await ZoneTravail.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone de travail non trouvée' });
    res.status(200).json(zone);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la zone de travail' });
  }
};

const createZoneTravail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdUtilisateur, Pays, Ville } = req.body;

  try {
    const zone = await ZoneTravail.create({
      IdUtilisateur,
      Pays,
      Ville
    });
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la zone de travail' });
  }
};

const updateZoneTravail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await ZoneTravail.update(req.body, {
      where: { IdZoneTravail: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Zone non trouvée' });
    res.status(200).json({ message: 'Zone mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchZoneTravail = async (req, res) => {
  try {
    const [updated] = await ZoneTravail.update(req.body, {
      where: { IdZoneTravail: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Zone non trouvée' });
    res.status(200).json({ message: 'Zone partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteZoneTravail = async (req, res) => {
  try {
    const deleted = await ZoneTravail.destroy({
      where: { IdZoneTravail: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: 'Zone non trouvée' });
    res.status(200).json({ message: 'Zone supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllZonesTravail,
  getZoneTravailById,
  createZoneTravail,
  updateZoneTravail,
  patchZoneTravail,
  deleteZoneTravail
};