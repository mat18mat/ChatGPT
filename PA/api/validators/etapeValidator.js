const { body } = require('express-validator');

exports.etapeValidator = [
  body('TempsDébut').isString().notEmpty(),
  body('TempsFin').isString().notEmpty(),
  body('Nom').isString().notEmpty().withMessage('Nom de l\'étape requis'),
  body('Début').isString().notEmpty(),
  body('Fin').isString().notEmpty(),
  body('Validé').isBoolean().withMessage('Validé doit être un booléen'),
  body('Description').optional().isString()
];