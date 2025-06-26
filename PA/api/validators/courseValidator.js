const { body } = require('express-validator');

const courseValidator = [
  body('Debut').optional().isISO8601().toDate().withMessage('Date de début invalide'),
  body('Fin').optional().isISO8601().toDate().withMessage('Date de fin invalide'),
  body('Valide').optional().isBoolean().withMessage('Valide doit être un booléen'),
  body('Prix').optional().isFloat().withMessage('Prix doit être un nombre'),
  body('Description').optional().isString(),
  body('AdresseDepart').optional().isString(),
  body('AdresseArrivee').optional().isString(),
  body('Statut').isIn(['en attente', 'en cours', 'livree']).withMessage('Statut invalide'),
  body('IdLivreur').optional().isInt(),
  body('IdExpediteur').isInt().withMessage('IdExpediteur requis')
];

module.exports = {
  courseValidator
};