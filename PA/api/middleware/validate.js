const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Données invalides',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
}

module.exports = validate;