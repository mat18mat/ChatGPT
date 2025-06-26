const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const factureController = require('../controllers/factureController');
const { factureValidator } = require('../validators/factureValidator');

// GET toutes les factures
router.get('/', factureController.getAllFactures);

// GET une facture par ID
router.get('/:id', factureController.getFactureById);

// POST créer une facture
router.post('/', factureValidator, validate, factureController.createFacture);

// PUT mettre à jour entièrement une facture
router.put('/:id', factureValidator, validate, factureController.updateFacture);

// PATCH mise à jour partielle
router.patch('/:id', factureController.patchFacture);

// DELETE une facture
router.delete('/:id', factureController.deleteFacture);

module.exports = router;