const { body } = require('express-validator');

const mediaAnnonceValidator = [
  body('IdAnnonce').isInt().withMessage('IdAnnonce doit être un entier'),
  body('LienMedia').notEmpty().isString().withMessage('LienMedia est requis')
];

module.exports = {
  mediaAnnonceValidator
};