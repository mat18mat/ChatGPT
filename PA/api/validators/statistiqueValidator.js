const { body } = require('express-validator');

const statistiqueValidator = [
  body('TypeStatistique')
    .notEmpty().withMessage('TypeStatistique requis')
    .isString().withMessage('TypeStatistique doit être une chaîne'),
  body('Categorie')
    .notEmpty().withMessage('Categorie requise')
    .isString().withMessage('Categorie doit être une chaîne'),
  body('Valeur')
    .isFloat().withMessage('Valeur doit être un nombre décimal'),
  body('TexteOptionnel')
    .optional()
    .isString().withMessage('TexteOptionnel doit être une chaîne'),
  body('IdSource')
    .optional()
    .isInt().withMessage('IdSource doit être un entier'),
  body('SourceType')
    .isIn(['Utilisateur', 'Facture', 'Course', 'Annonce', 'Livreur', 'Prestataire', 'Evaluation'])
    .withMessage('SourceType invalide'),
  body('DateCalcul')
    .optional()
    .isISO8601().withMessage('DateCalcul doit être une date valide')
];

module.exports = {
  statistiqueValidator
};