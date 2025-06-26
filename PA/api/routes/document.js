const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const documentController = require('../controllers/documentController');
const { documentValidator } = require('../validators/documentValidator');

// GET tous les documents
router.get('/', documentController.getAllDocuments);

// GET un document par ID
router.get('/:id', documentController.getDocumentById);

// POST créer un document
router.post('/', documentValidator, validate, documentController.createDocument);

// PUT (remplacement complet)
router.put('/:id', documentValidator, validate, documentController.updateDocument);

// PATCH (mise à jour partielle)
router.patch('/:id', documentController.patchDocument);

// DELETE un document
router.delete('/:id', documentController.deleteDocument);

module.exports = router;