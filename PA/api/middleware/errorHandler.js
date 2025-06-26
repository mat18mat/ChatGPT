function errorHandler(err, req, res, next) {
  console.error('[ERREUR]', err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Token invalide ou manquant' });
  }

  if (err.status && err.message) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({
    message: 'Une erreur inattendue est survenue'
  });
}

module.exports = { errorHandler };