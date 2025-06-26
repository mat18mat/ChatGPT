const { body } = require('express-validator');

const logValidator = [
  body('lAction')
    .notEmpty().withMessage('L’action est requise')
    .isString().withMessage('L’action doit être une chaîne de caractères'),

  body('Timestamp')
    .notEmpty().withMessage('Le timestamp est requis')
    .isISO8601().withMessage('Le timestamp doit être au format ISO 8601'),

  body('IP')
    .optional()
    .isString().withMessage('L’IP doit être une chaîne de caractères')
    .isLength({ max: 45 }).withMessage('L’IP ne peut pas dépasser 45 caractères'),

  body('NavigateurAppareil')
    .optional()
    .isString().withMessage('Le navigateur/appareil doit être une chaîne de caractères'),

  body('IdUtilisateur')
    .notEmpty().withMessage('L’identifiant utilisateur est requis')
    .isInt().withMessage('L’identifiant utilisateur doit être un entier'),
];

module.exports = {
  logValidator
};