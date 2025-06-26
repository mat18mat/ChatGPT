const { body } = require('express-validator');

const prestataireValidator = [
  body('OptionGrossiste').isBoolean().withMessage('OptionGrossiste doit être un booléen'),
  body('Habilitations').optional().isString(),
  body('Tarifs').optional().isString(),
  body('Approuve').isBoolean().withMessage('Approuve doit être un booléen'),
  body('Actif').optional().isBoolean(),
  body('IdAnnonce').isInt().withMessage('IdAnnonce doit être un entier'),
  body('IdContrat').isInt().withMessage('IdContrat doit être un entier')
];

module.exports = {
  prestataireValidator
};