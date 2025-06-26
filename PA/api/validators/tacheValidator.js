const { body } = require('express-validator');

const tacheValidator = [
  body('Temps').isString().withMessage('Temps requis (format HH:MM:SS)'),
  body('Debut').isString().withMessage('Debut requis (format HH:MM:SS)'),
  body('Fin').isString().withMessage('Fin requis (format HH:MM:SS)'),
  body('DateJour').isISO8601().withMessage('DateJour invalide'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier')
];

module.exports = {
  tacheValidator
};