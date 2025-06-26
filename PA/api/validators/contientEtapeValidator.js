const { body } = require('express-validator');

const contientEtapeValidator = [
  body('IdEtape').isInt().withMessage('IdEtape doit être un entier'),
  body('IdCourse').isInt().withMessage('IdCourse doit être un entier')
];

module.exports = {
  contientEtapeValidator
};