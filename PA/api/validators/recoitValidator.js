const { body } = require('express-validator');

const recoitValidator = [
  body('IdNotification').isInt().withMessage('IdNotification doit être un entier'),
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier')
];

module.exports = {
  recoitValidator
};