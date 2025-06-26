const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const entrepotController = require('../controllers/entrepotController');
const { entrepotValidator } = require('../validators/entrepotValidator');

// GET tous les entrepôts
router.get('/', entrepotController.getAllEntrepots);

// GET un entrepôt par ID
router.get('/:id', entrepotController.getEntrepotById);

// POST créer un entrepôt
router.post('/', entrepotValidator, validate, entrepotController.createEntrepot);

// PUT modifier un entrepôt
router.put('/:id', entrepotValidator, validate, entrepotController.updateEntrepot);

// PATCH modifier partiellement un entrepôt
router.patch('/:id', entrepotController.patchEntrepot);

// DELETE un entrepôt
router.delete('/:id', entrepotController.deleteEntrepot);

module.exports = router;