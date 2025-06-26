const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const roleController = require('../controllers/roleController');
const { roleValidator } = require('../validators/roleValidator');

// GET tous les rôles
router.get('/', roleController.getAllRoles);

// GET un rôle par ID
router.get('/:id', roleController.getRoleById);

// POST créer un rôle
router.post('/', roleValidator, validate, roleController.createRole);

// PUT modifier complètement un rôle
router.put('/:id', roleValidator, validate, roleController.updateRole);

// PATCH mise à jour partielle
router.patch('/:id', roleController.patchRole);

// DELETE supprimer un rôle
router.delete('/:id', roleController.deleteRole);

module.exports = router;