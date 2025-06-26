const { body } = require('express-validator');

const notificationValidator = [
  body('Message').notEmpty().isString().withMessage('Message est requis'),
  body('Date').isISO8601().toDate().withMessage('Date invalide'),
  body('Lu').optional().isBoolean().withMessage('Lu doit être un booléen'),
  body('Type').optional().isString().withMessage('Type doit être une chaîne'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier')
];

module.exports = {
  notificationValidator
};