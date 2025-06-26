const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const boxAccessController = require('../controllers/boxAccessController');
const { boxAccessValidator } = require('../validators/boxAccessValidator');

// GET tous les accès
router.get('/', boxAccessController.getAllBoxAccess);

// GET un accès par ID
router.get('/:id', boxAccessController.getBoxAccessById);

// POST créer un accès
router.post('/', boxAccessValidator, validate, boxAccessController.createBoxAccess);

// PUT mise à jour complète
router.put('/:id', boxAccessValidator, validate, boxAccessController.updateBoxAccess);

// PATCH mise à jour partielle
router.patch('/:id', boxAccessController.patchBoxAccess);

// DELETE un accès
router.delete('/:id', boxAccessController.deleteBoxAccess);

module.exports = router;