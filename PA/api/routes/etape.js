const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const etapeController = require('../controllers/etapeController');
const { etapeValidator } = require('../validators/etapeValidator');

// GET toutes les étapes
router.get('/', etapeController.getAllEtapes);

// GET une étape par ID
router.get('/:id', etapeController.getEtapeById);

// POST créer une étape
router.post('/', etapeValidator, validate, etapeController.createEtape);

// PUT mettre à jour complètement
router.put('/:id', etapeValidator, validate, etapeController.updateEtape);

// PATCH mise à jour partielle
router.patch('/:id', etapeController.patchEtape);

// DELETE une étape
router.delete('/:id', etapeController.deleteEtape);

module.exports = router;