const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const effectueParController = require('../controllers/effectueParController');
const { effectueParValidator } = require('../validators/effectueParValidator');

// GET toutes les relations livreur-course
router.get('/', effectueParController.getAll);

// GET une relation spécifique
router.get('/:idLivreur/:idCourse', effectueParController.getOne);

// POST créer une liaison
router.post('/', effectueParValidator, validate, effectueParController.create);

// DELETE une liaison
router.delete('/:idLivreur/:idCourse', effectueParController.deleteOne);

module.exports = router;