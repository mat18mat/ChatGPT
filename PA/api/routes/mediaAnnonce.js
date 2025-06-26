const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const mediaAnnonceController = require('../controllers/mediaAnnonceController');
const { mediaAnnonceValidator } = require('../validators/mediaAnnonceValidator');

// GET tous les médias
router.get('/', mediaAnnonceController.getAllMedia);

// GET un média par ID
router.get('/:id', mediaAnnonceController.getMediaById);

// POST créer un média
router.post('/', mediaAnnonceValidator, validate, mediaAnnonceController.createMedia);

// PUT (remplacement complet)
router.put('/:id', mediaAnnonceValidator, validate, mediaAnnonceController.updateMedia);

// PATCH (mise à jour partielle)
router.patch('/:id', mediaAnnonceController.patchMedia);

// DELETE un média
router.delete('/:id', mediaAnnonceController.deleteMedia);

module.exports = router;