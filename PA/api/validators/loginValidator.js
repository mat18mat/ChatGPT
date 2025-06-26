const { body, validationResult } = require('express-validator');

const loginValidator = [
  body('mail')
    .isEmail().withMessage('L’adresse email doit être valide'),

  body('Mdp')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array().map(e => e.msg) });
    next();
  }
];

module.exports = loginValidator;