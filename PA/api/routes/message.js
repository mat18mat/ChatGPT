const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const messageController = require('../controllers/messageController');
const { messageValidator } = require('../validators/messageValidator');

// GET tous les messages
router.get('/', messageController.getAllMessages);

// GET un message par ID
router.get('/:id', messageController.getMessageById);

// POST créer un message
router.post('/', messageValidator, validate, messageController.createMessage);

// PUT (remplacement complet)
router.put('/:id', messageValidator, validate, messageController.updateMessage);

// PATCH (mise à jour partielle)
router.patch('/:id', messageController.patchMessage);

// DELETE un message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;