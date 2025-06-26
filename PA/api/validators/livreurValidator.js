const { body } = require('express-validator');

const livreurValidator = [
  body('OptionGrossiste').isBoolean().withMessage('OptionGrossiste doit être un booléen'),
  body('Vehicule').isString().notEmpty().withMessage('Vehicule requis'),
  body('Actif').optional().isBoolean().withMessage('Actif doit être un booléen'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdContrat').isInt().withMessage('IdContrat doit être un entier')
];

module.exports = {
  livreurValidator
};