const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const evaluationController = require('../controllers/evaluationController');
const { evaluationValidator } = require('../validators/evaluationValidator');

// GET toutes les évaluations
router.get('/', evaluationController.getAllEvaluations);

// GET une évaluation par ID
router.get('/:id', evaluationController.getEvaluationById);

// POST créer une évaluation
router.post('/', evaluationValidator, validate, evaluationController.createEvaluation);

// PUT (remplacement complet)
router.put('/:id', evaluationValidator, validate, evaluationController.updateEvaluation);

// PATCH (mise à jour partielle)
router.patch('/:id', evaluationController.patchEvaluation);

// DELETE une évaluation
router.delete('/:id', evaluationController.deleteEvaluation);

module.exports = router;