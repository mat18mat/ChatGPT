const { body } = require('express-validator');

const commercantValidator = [
  body('IdContrat').isInt().withMessage('IdContrat doit être un entier'),
  body('OptionGrossiste').isBoolean().withMessage('OptionGrossiste doit être un booléen'),
  body('HeureOuverture').isString().withMessage('HeureOuverture est invalide'),
  body('Actif').optional().isBoolean(),
  body('NomCommerce').notEmpty().isString().withMessage('NomCommerce est requis'),
  body('TypeCommerce').notEmpty().isString().withMessage('TypeCommerce est requis'),
  body('SIRET').notEmpty().isString().withMessage('SIRET est requis'),
  body('IdEntrepot').isInt().withMessage('IdEntrepot doit être un entier'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdCourse').optional().isInt()
];

module.exports = {
  commercantValidator
};