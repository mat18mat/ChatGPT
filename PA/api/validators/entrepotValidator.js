const { body } = require('express-validator');

const entrepotValidator = [
  body('Localisation')
    .notEmpty().withMessage('La localisation est requise')
    .isString().withMessage('La localisation doit être une chaîne de caractères'),
  body('Secteur')
    .notEmpty().withMessage('Le secteur est requis')
    .isString().withMessage('Le secteur doit être une chaîne de caractères'),
  body('Capacite')
    .notEmpty().withMessage('La capacité est requise')
    .isInt({ min: 0 }).withMessage('La capacité doit être un entier positif'),
];

module.exports = { entrepotValidator };