const { body } = require('express-validator');

const boxAccessValidator = [
  body('IdBox').isInt().withMessage('IdBox doit être un entier'),
  body('EmailInvite').isEmail().withMessage('EmailInvite doit être un email valide'),
  body('TypeAcces').isIn(['lecture', 'complet']).withMessage('TypeAcces invalide')
];

module.exports = {
  boxAccessValidator
};