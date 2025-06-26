const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const tacheController = require('../controllers/tacheController');
const { tacheValidator } = require('../validators/tacheValidator');

// GET toutes les tâches
router.get('/', tacheController.getAllTaches);

// GET une tâche par ID
router.get('/:id', tacheController.getTacheById);

// POST créer une tâche
router.post('/', tacheValidator, validate, tacheController.createTache);

// PUT mise à jour complète
router.put('/:id', tacheValidator, validate, tacheController.updateTache);

// PATCH mise à jour partielle
router.patch('/:id', tacheController.patchTache);

// DELETE une tâche
router.delete('/:id', tacheController.deleteTache);

module.exports = router;