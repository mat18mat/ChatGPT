const { body } = require('express-validator');

const roleUtilisateurValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdRole').isInt().withMessage('IdRole doit être un entier')
];

module.exports = {
  roleUtilisateurValidator
};