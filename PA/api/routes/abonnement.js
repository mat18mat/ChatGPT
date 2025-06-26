const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const abonnementController = require('../controllers/abonnementController');
const { abonnementValidator } = require('../validators/abonnementValidator');

// GET tous les abonnements
router.get('/', abonnementController.getAllAbonnements);

// GET un abonnement par ID
router.get('/:id', abonnementController.getAbonnementById);

// POST créer un abonnement
router.post('/', abonnementValidator, validate, abonnementController.createAbonnement);

// PUT mettre à jour complètement
router.put('/:id', abonnementValidator, validate, abonnementController.updateAbonnement);

// PATCH mettre à jour partiellement
router.patch('/:id', abonnementController.patchAbonnement);

// DELETE un abonnement
router.delete('/:id', abonnementController.deleteAbonnement);

module.exports = router;