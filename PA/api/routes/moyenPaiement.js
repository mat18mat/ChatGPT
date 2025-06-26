const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const moyenPaiementController = require('../controllers/moyenPaiementController');
const { moyenPaiementValidator } = require('../validators/moyenPaiementValidator');

// GET tous les moyens de paiement
router.get('/', moyenPaiementController.getAllMoyensPaiement);

// GET un moyen de paiement par ID
router.get('/:id', moyenPaiementController.getMoyenPaiementById);

// POST créer un moyen de paiement
router.post('/', moyenPaiementValidator, validate, moyenPaiementController.createMoyenPaiement);

// PUT mise à jour complète
router.put('/:id', moyenPaiementValidator, validate, moyenPaiementController.updateMoyenPaiement);

// PATCH mise à jour partielle
router.patch('/:id', moyenPaiementController.patchMoyenPaiement);

// DELETE un moyen de paiement
router.delete('/:id', moyenPaiementController.deleteMoyenPaiement);

module.exports = router;