const { validationResult } = require('express-validator');
const Role = require('../models').Role;

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du rôle' });
  }
};

const createRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { Nom } = req.body;

  try {
    const role = await Role.create({ Nom });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du rôle' });
  }
};

const updateRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Role.update(req.body, {
      where: { IdRole: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.status(200).json({ message: 'Rôle mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchRole = async (req, res) => {
  try {
    const [updated] = await Role.update(req.body, {
      where: { IdRole: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.status(200).json({ message: 'Rôle mis à jour partiellement' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { IdRole: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Rôle non trouvé' });
    res.status(200).json({ message: 'Rôle supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  patchRole,
  deleteRole
};