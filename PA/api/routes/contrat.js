const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const contratController = require('../controllers/contratController');
const { contratValidator } = require('../validators/contratValidator');

// GET tous les contrats
router.get('/', contratController.getAllContrats);

// GET un contrat par ID
router.get('/:id', contratController.getContratById);

// POST créer un contrat
router.post('/', contratValidator, validate, contratController.createContrat);

// PUT (remplacement complet)
router.put('/:id', contratValidator, validate, contratController.updateContrat);

// PATCH (mise à jour partielle)
router.patch('/:id', contratController.patchContrat);

// DELETE un contrat
router.delete('/:id', contratController.deleteContrat);

module.exports = router;