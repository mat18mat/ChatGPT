const { body } = require('express-validator');

const contratValidator = [
  body('TypeContrat').notEmpty().isString().withMessage('TypeContrat requis'),
  body('Debut').isISO8601().toDate().withMessage('Debut invalide'),
  body('Fin').isISO8601().toDate().withMessage('Fin invalide'),
  body('Remuneration').isFloat().withMessage('Remuneration doit être un nombre'),
  body('MethodeRemuneration').optional().isString(),
  body('Description').optional().isString(),
  body('Statut').isIn(['en attente', 'actif', 'refuse', 'terminee']).withMessage('Statut invalide'),
  body('IdContracteur').isInt().withMessage('IdContracteur doit être un entier'),
  body('IdDemandeur').isInt().withMessage('IdDemandeur doit être un entier'),
  body('LienPDF').optional().isString(),
  body('Template').optional().isBoolean()
];

module.exports = {
  contratValidator
};