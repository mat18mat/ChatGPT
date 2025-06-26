const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
const validate = require('../middleware/validate');
const zoneTravailController = require('../controllers/zoneTravailController');
const {zoneTravailValidator} = require('../validators/zoneTravailValidator');

router.use(authenticateJwt);

// GET toutes les zones de travail
router.get('/', zoneTravailController.getAllZonesTravail);

// GET une zone par ID
router.get('/:id', zoneTravailController.getZoneTravailById);

// POST créer une zone
router.post('/', zoneTravailValidator, validate, zoneTravailController.createZoneTravail);

// PUT mise à jour complète
router.put('/:id', zoneTravailValidator, validate, zoneTravailController.updateZoneTravail);

// PATCH mise à jour partielle
router.patch('/:id', zoneTravailController.patchZoneTravail);

// DELETE une zone
router.delete('/:id', zoneTravailController.deleteZoneTravail);

module.exports = router;