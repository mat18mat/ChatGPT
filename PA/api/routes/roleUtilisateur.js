const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const roleUtilisateurController = require('../controllers/roleUtilisateurController');
const { roleUtilisateurValidator } = require('../validators/roleUtilisateurValidator');

// GET tous les rôles-utilisateurs
router.get('/', roleUtilisateurController.getAllRoleUtilisateurs);

// GET un lien rôle-utilisateur
router.get('/:userId/:roleId', roleUtilisateurController.getRoleUtilisateur);

// POST ajouter une liaison utilisateur-rôle
router.post('/', roleUtilisateurValidator, validate, roleUtilisateurController.createRoleUtilisateur);

// DELETE une liaison
router.delete('/:userId/:roleId', roleUtilisateurController.deleteRoleUtilisateur);

module.exports = router;