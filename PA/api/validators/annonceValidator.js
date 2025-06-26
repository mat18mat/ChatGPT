const { body } = require('express-validator');

const annonceValidator = [
  body('Type').notEmpty().isString().withMessage('Type requis'),
  body('Titre').notEmpty().isString().withMessage('Titre requis'),
  body('Statut').isIn(['brouillon', 'publiee', 'terminee']).withMessage('Statut invalide'),
  body('Prix').optional().isFloat().withMessage('Prix doit être un nombre'),
  body('Temps').optional().isString(),
  body('Debut').optional().isString(),
  body('Fin').optional().isString(),
  body('Pays').optional().isString(),
  body('Adresse').optional().isString(),
  body('LienImage').optional().isString(),
  body('DateSouhaitee').optional().isISO8601().toDate(),
  body('Description').optional().isString(),
  body('IdCreateur').isInt().withMessage('IdCreateur requis'),
  body('IdTache').optional().isInt()
];

module.exports = {
  annonceValidator
};