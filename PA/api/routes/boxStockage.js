const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const boxStockageController = require('../controllers/boxStockageController');
const { boxStockageValidator } = require('../validators/boxStockageValidator');

// GET tous les box de stockage
router.get('/', boxStockageController.getAllBoxStockage);

// GET un box par ID
router.get('/:id', boxStockageController.getBoxStockageById);

// POST créer un box
router.post('/', boxStockageValidator, validate, boxStockageController.createBoxStockage);

// PUT mise à jour complète
router.put('/:id', boxStockageValidator, validate, boxStockageController.updateBoxStockage);

// PATCH mise à jour partielle
router.patch('/:id', boxStockageController.patchBoxStockage);

// DELETE un box
router.delete('/:id', boxStockageController.deleteBoxStockage);

module.exports = router;