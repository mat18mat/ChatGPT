const Joi = require('joi');

const langueSchema = Joi.object({
  Code: Joi.string().max(10).required(),
  NomAffiche: Joi.string().max(100).required(),
  FichierJSON: Joi.string().required()
});

module.exports = {
  langueSchema
};