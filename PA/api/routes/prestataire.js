const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const prestataireController = require('../controllers/prestataireController');
const { prestataireValidator } = require('../validators/prestataireValidator');

// GET tous les prestataires
router.get('/', prestataireController.getAllPrestataires);

// GET un prestataire par ID
router.get('/:id', prestataireController.getPrestataireById);

// POST créer un prestataire
router.post('/', prestataireValidator, validate, prestataireController.createPrestataire);

// PUT mise à jour complète
router.put('/:id', prestataireValidator, validate, prestataireController.updatePrestataire);

// PATCH mise à jour partielle
router.patch('/:id', prestataireController.patchPrestataire);

// DELETE un prestataire
router.delete('/:id', prestataireController.deletePrestataire);

module.exports = router;