const { body } = require('express-validator');

const roleValidator = [
  body('Nom')
    .notEmpty()
    .withMessage('Le nom du rôle est requis')
    .isString()
    .withMessage('Le nom doit être une chaîne de caractères')
];

module.exports = {
  roleValidator
};