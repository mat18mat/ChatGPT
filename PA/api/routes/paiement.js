const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const paiementController = require('../controllers/paiementController');
const { paiementValidator } = require('../validators/paiementValidator');

// GET tous les paiements
router.get('/', paiementController.getAllPaiements);

// GET un paiement par ID
router.get('/:id', paiementController.getPaiementById);

// POST créer un paiement
router.post('/', paiementValidator, validate, paiementController.createPaiement);

// PUT mise à jour complète
router.put('/:id', paiementValidator, validate, paiementController.updatePaiement);

// PATCH mise à jour partielle
router.patch('/:id', paiementController.patchPaiement);

// DELETE un paiement
router.delete('/:id', paiementController.deletePaiement);

router.post('/stripe-session', paiementController.createStripeSession);

router.post('/stripe-subscription-session', paiementController.createStripeSubscriptionSession);

module.exports = router;