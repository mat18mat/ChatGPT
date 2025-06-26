const { validationResult } = require('express-validator');
const RoleUtilisateur = require('../models').RoleUtilisateur;

const getAllRoleUtilisateurs = async (req, res) => {
  try {
    const list = await RoleUtilisateur.findAll();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des liens rôle-utilisateur' });
  }
};

const getRoleUtilisateur = async (req, res) => {
  const { userId, roleId } = req.params;

  try {
    const record = await RoleUtilisateur.findOne({
      where: { IdUtilisateur: userId, IdRole: roleId }
    });

    if (!record) return res.status(404).json({ message: 'Association non trouvée' });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du lien' });
  }
};

const createRoleUtilisateur = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdUtilisateur, IdRole } = req.body;

  try {
    const record = await RoleUtilisateur.create({ IdUtilisateur, IdRole });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du lien rôle-utilisateur' });
  }
};

const deleteRoleUtilisateur = async (req, res) => {
  const { userId, roleId } = req.params;

  try {
    const deleted = await RoleUtilisateur.destroy({
      where: { IdUtilisateur: userId, IdRole: roleId }
    });

    if (!deleted) return res.status(404).json({ message: 'Lien non trouvé' });
    res.status(200).json({ message: 'Lien supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du lien' });
  }
};

module.exports = {
  getAllRoleUtilisateurs,
  getRoleUtilisateur,
  createRoleUtilisateur,
  deleteRoleUtilisateur
};