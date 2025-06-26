const { body } = require('express-validator');

const paiementValidator = [
  body('IdUtilisateur').isInt().withMessage('IdUtilisateur doit être un entier'),
  body('Montant').isFloat({ gt: 0 }).withMessage('Montant doit être un nombre positif'),
  body('TypePaiement').isIn(['Mensuel', 'Sur Place']).withMessage('TypePaiement invalide'),
  body('DatePaiement').isISO8601().toDate().withMessage('DatePaiement invalide'),
  body('Statut').isIn(['Effectue', 'En Attente', 'Echoue']).withMessage('Statut invalide'),
  body('IdFacture').isInt().withMessage('IdFacture doit être un entier'),
  body('IdMoyenPaiement').isInt().withMessage('IdMoyenPaiement doit être un entier')
];

module.exports = {
  paiementValidator
};