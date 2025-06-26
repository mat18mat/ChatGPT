const { body } = require('express-validator');

const effectueParValidator = [
  body('IdLivreur').isInt().withMessage('IdLivreur doit être un entier'),
  body('IdCourse').isInt().withMessage('IdCourse doit être un entier')
];

module.exports = {
  effectueParValidator
};