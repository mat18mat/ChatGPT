const { body } = require('express-validator');

const conversationValidator = [
  body('Sujet').isString().notEmpty().withMessage('Sujet est requis')
];

module.exports = {
  conversationValidator
};