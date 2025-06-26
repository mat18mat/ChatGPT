const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const contientEtapeController = require('../controllers/contientEtapeController');
const { contientEtapeValidator } = require('../validators/contientEtapeValidator');

// GET toutes les relations
router.get('/', contientEtapeController.getAll);

// GET une relation spécifique
router.get('/:idEtape/:idCourse', contientEtapeController.getOne);

// POST créer une liaison
router.post('/', contientEtapeValidator, validate, contientEtapeController.create);

// DELETE une liaison
router.delete('/:idEtape/:idCourse', contientEtapeController.deleteOne);

module.exports = router;