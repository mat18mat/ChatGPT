const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const logController = require('../controllers/logController');
const { logValidator } = require('../validators/logValidator');

// GET tous les logs
router.get('/', logController.getAllLogs);

// GET un log par ID
router.get('/:id', logController.getLogById);

// POST créer un log
router.post('/', logValidator, validate, logController.createLog);

// PUT (remplacement complet)
router.put('/:id', logValidator, validate, logController.updateLog);

// PATCH (mise à jour partielle)
router.patch('/:id', logController.patchLog);

// DELETE un log
router.delete('/:id', logController.deleteLog);

module.exports = router;