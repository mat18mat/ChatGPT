const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const conversationController = require('../controllers/conversationController');
const { conversationValidator } = require('../validators/conversationValidator');

// GET toutes les conversations
router.get('/', conversationController.getAllConversations);

// GET une conversation par ID
router.get('/:id', conversationController.getConversationById);

// POST créer une conversation
router.post('/', conversationValidator, validate, conversationController.createConversation);

// PUT (remplacement complet)
router.put('/:id', conversationValidator, validate, conversationController.updateConversation);

// PATCH (mise à jour partielle)
router.patch('/:id', conversationController.patchConversation);

// DELETE une conversation
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;