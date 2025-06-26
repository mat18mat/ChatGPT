const { body } = require('express-validator');

const evaluationValidator = [
  body('Note').isInt({ min: 0, max: 5 }).withMessage('Note doit être un entier entre 0 et 5'),
  body('Commentaire').optional().isString().withMessage('Commentaire doit être un texte'),
  body('Date').isISO8601().toDate().withMessage('Date invalide'),
  body('TypeDestinataire').isIn(['Prestataire', 'Livreur', 'Commercant', 'Utilisateur']).withMessage('TypeDestinataire invalide'),
  body('IdCible').isInt().withMessage('IdCible doit être un entier'),
  body('IdEvalueur').isInt().withMessage('IdEvalueur doit être un entier')
];

module.exports = {
  evaluationValidator
};