const { body } = require('express-validator');

const colisValidator = [
  body('Description').optional().isString().withMessage('Description doit être une chaîne'),
  body('Dimensions').optional().isString().withMessage('Dimensions doit être une chaîne'),
  body('IdDestinataire').isInt().withMessage('IdDestinataire doit être un entier'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdCourse').isInt().withMessage('IdCourse doit être un entier')
];

module.exports = {
  colisValidator
};