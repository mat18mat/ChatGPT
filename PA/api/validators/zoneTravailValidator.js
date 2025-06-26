const { body } = require('express-validator');

const zoneTravailValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('Pays').notEmpty().isString().withMessage('Pays est requis'),
  body('Ville').notEmpty().isString().withMessage('Ville est requise')
];

module.exports = {
  zoneTravailValidator
};