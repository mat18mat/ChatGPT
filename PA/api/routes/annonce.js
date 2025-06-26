const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const annonceController = require('../controllers/annonceController');
const { annonceValidator } = require('../validators/annonceValidator');

// GET toutes les annonces
router.get('/', annonceController.getAllAnnonces);

// GET une annonce par ID
router.get('/:id', annonceController.getAnnonceById);

// POST créer une annonce
router.post('/', annonceValidator, validate, annonceController.createAnnonce);

// PUT mettre à jour complètement une annonce
router.put('/:id', annonceValidator, validate, annonceController.updateAnnonce);

// PATCH mise à jour partielle
router.patch('/:id', annonceController.patchAnnonce);

// DELETE une annonce
router.delete('/:id', annonceController.deleteAnnonce);

module.exports = router;