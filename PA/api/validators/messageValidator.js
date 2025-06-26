const { body } = require('express-validator');

const messageValidator = [
  body('IdConversation').isInt().withMessage('IdConversation doit être un entier'),
  body('IdEnvoyeur').isInt().withMessage('IdEnvoyeur doit être un entier'),
  body('Contenu').notEmpty().isString().withMessage('Contenu est requis'),
  body('Lu').optional().isBoolean().withMessage('Lu doit être un booléen')
];

module.exports = {
  messageValidator
};