const { body } = require('express-validator');

const moyenPaiementValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('TypePaiement').isIn(['Carte', 'IBAN']).withMessage('TypePaiement doit être Carte ou IBAN'),
  body('Informations').optional().isString(),
  body('ParDefaut').optional().isBoolean().withMessage('ParDefaut doit être un booléen'),
  body('DateAjout').optional().isISO8601().toDate().withMessage('DateAjout invalide')
];

module.exports = {
  moyenPaiementValidator
};