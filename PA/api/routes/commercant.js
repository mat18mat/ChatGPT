const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const commercantController = require('../controllers/commercantController');
const { commercantValidator } = require('../validators/commercantValidator');

// GET tous les commerçants
router.get('/', commercantController.getAllCommercants);

// GET un commerçant par ID
router.get('/:id', commercantController.getCommercantById);

// POST créer un commerçant
router.post('/', commercantValidator, validate, commercantController.createCommercant);

// PUT mise à jour complète
router.put('/:id', commercantValidator, validate, commercantController.updateCommercant);

// PATCH mise à jour partielle
router.patch('/:id', commercantController.patchCommercant);

// DELETE un commerçant
router.delete('/:id', commercantController.deleteCommercant);

module.exports = router;