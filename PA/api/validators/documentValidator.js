const { body } = require('express-validator');

const allowedTypes = [
  'Identite',
  'Justificatif',
  'Permis',
  'Assurance',
  'Diplome',
  'KBIS'
];

const documentValidator = [
  body('IdUtilisateur')
    .exists().withMessage('L\'identifiant utilisateur est requis')
    .bail()
    .isInt({ gt: 0 }).withMessage('IdUtilisateur doit être un entier positif'),

  body('TypeDocument')
    .exists().withMessage('Le type de document est requis')
    .bail()
    .isIn(allowedTypes).withMessage(`TypeDocument invalide (doit être l’un de : ${allowedTypes.join(', ')})`),

  body('Fichier')
    .exists().withMessage('Le champ "Fichier" est requis')
    .bail()
    .notEmpty().withMessage('Le champ "Fichier" ne peut pas être vide'),

  body('DateAjout')
    .optional()
    .isISO8601().withMessage('DateAjout doit être une date valide au format ISO8601'),
];

module.exports = { documentValidator };