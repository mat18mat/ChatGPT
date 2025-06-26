const { body } = require('express-validator');

const boxStockageValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('IdEntrepot').isInt().withMessage('IdEntrepot doit être un entier'),
  body('DateDebut').isISO8601().toDate().withMessage('DateDebut invalide'),
  body('DateFin').isISO8601().toDate().withMessage('DateFin invalide'),
  body('Taille').isIn(['petite', 'moyenne', 'grande']).withMessage('Taille invalide'),
  body('TypeBox').isIn(['standard', 'temperee']).withMessage('TypeBox invalide'),
  body('Statut').isIn(['active', 'terminee', 'en attente']).withMessage('Statut invalide'),
  body('Assurance').isBoolean().withMessage('Assurance doit être un booléen'),
  body('Description').optional().isString()
];

module.exports = {
  boxStockageValidator
};