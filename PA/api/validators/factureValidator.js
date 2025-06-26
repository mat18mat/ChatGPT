const { body } = require('express-validator');

const factureValidator = [
  body('MontantTotal').isFloat().withMessage('MontantTotal doit être un nombre'),
  body('DateCreation').isISO8601().toDate().withMessage('DateCreation invalide'),
  body('LienPDF').optional().isString(),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdAbonnement').optional().isInt().withMessage('IdAbonnement doit être un entier')
];

module.exports = {
  factureValidator
};