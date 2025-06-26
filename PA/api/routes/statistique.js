const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const statistiqueController = require('../controllers/statistiqueController');
const { statistiqueValidator } = require('../validators/statistiqueValidator');

// GET toutes les statistiques
router.get('/', statistiqueController.getAllStatistiques);

// GET une statistique par ID
router.get('/:id', statistiqueController.getStatistiqueById);

// POST créer une statistique
router.post('/', statistiqueValidator, validate, statistiqueController.createStatistique);

// PUT mise à jour complète
router.put('/:id', statistiqueValidator, validate, statistiqueController.updateStatistique);

// PATCH mise à jour partielle
router.patch('/:id', statistiqueController.patchStatistique);

// DELETE une statistique
router.delete('/:id', statistiqueController.deleteStatistique);

module.exports = router;