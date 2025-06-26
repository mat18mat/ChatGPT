function notFoundHandler(req, res, next) {
    res.status(404).json({
      message: 'Ressource non trouvée',
      url: req.originalUrl
    });
  }
  
  module.exports = { notFoundHandler };  