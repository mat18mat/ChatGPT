const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const colisController = require('../controllers/colisController');
const { colisValidator } = require('../validators/colisValidator');

// GET tous les colis
router.get('/', colisController.getAllColis);

// GET un colis par ID
router.get('/:id', colisController.getColisById);

// POST créer un colis
router.post('/', colisValidator, validate, colisController.createColis);

// PUT (remplacement complet)
router.put('/:id', colisValidator, validate, colisController.updateColis);

// PATCH (mise à jour partielle)
router.patch('/:id', colisController.patchColis);

// DELETE un colis
router.delete('/:id', colisController.deleteColis);

module.exports = router;