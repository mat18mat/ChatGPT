const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const livreurController = require('../controllers/livreurController');
const { livreurValidator } = require('../validators/livreurValidator');

// GET tous les livreurs
router.get('/', livreurController.getAllLivreurs);

// GET un livreur par ID
router.get('/:id', livreurController.getLivreurById);

// POST créer un livreur
router.post('/', livreurValidator, validate, livreurController.createLivreur);

// PUT mise à jour complète
router.put('/:id', livreurValidator, validate, livreurController.updateLivreur);

// PATCH mise à jour partielle
router.patch('/:id', livreurController.patchLivreur);

// DELETE un livreur
router.delete('/:id', livreurController.deleteLivreur);

module.exports = router;