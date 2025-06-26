const { body } = require('express-validator');

const abonnementValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('Nom').notEmpty().isString().withMessage('Nom est requis'),
  body('PrixMensuel').isFloat().withMessage('PrixMensuel doit être un nombre'),
  body('Assurance').isBoolean().withMessage('Assurance doit être un booléen'),
  body('Reduction').isFloat().withMessage('Reduction doit être un nombre'),
  body('LivraisonPrioritaire').isBoolean().withMessage('LivraisonPrioritaire doit être un booléen'),
  body('ColisOfferts').isInt().withMessage('ColisOfferts doit être un entier'),
  body('Avantages').optional().isString(),
  body('Recurence').isIn(['Mensuel', 'Annuel']).withMessage('Recurence invalide'),
  body('DateDebut').isISO8601().toDate().withMessage('DateDebut invalide'),
  body('DateFin').isISO8601().toDate().withMessage('DateFin invalide')
];

module.exports = {
  abonnementValidator
};