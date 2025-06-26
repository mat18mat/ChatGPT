const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const notificationController = require('../controllers/notificationController');
const { notificationValidator } = require('../validators/notificationValidator');

// GET toutes les notifications
router.get('/', notificationController.getAllNotifications);

// GET une notification par ID
router.get('/:id', notificationController.getNotificationById);

// POST créer une notification
router.post('/', notificationValidator, validate, notificationController.createNotification);

// PUT (remplacement complet)
router.put('/:id', notificationValidator, validate, notificationController.updateNotification);

// PATCH (mise à jour partielle)
router.patch('/:id', notificationController.patchNotification);

// DELETE une notification
router.delete('/:id', notificationController.deleteNotification);

// POST /mail pour l'envoi d'e-mails
router.post('/mail', notificationController.sendNotificationMail);

module.exports = router;