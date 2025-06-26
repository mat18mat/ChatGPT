const Langue = require('../models/langue');
const { langueSchema } = require('../validators/langueValidator');

module.exports = {
  async createLangue(req, res) {
    try {
      const { error, value } = langueSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const langue = await Langue.create(value);
      res.status(201).json(langue);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getLangues(req, res) {
    try {
      const langues = await Langue.findAll();
      res.status(200).json(langues);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getLangueByCode(req, res) {
    try {
      const langue = await Langue.findByPk(req.params.code);
      if (!langue) return res.status(404).json({ error: 'Langue non trouvée' });

      res.status(200).json(langue);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateLangue(req, res) {
    try {
      const { error, value } = langueSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const [updated] = await Langue.update(value, {
        where: { Code: req.params.code }
      });

      if (!updated) return res.status(404).json({ error: 'Langue non trouvée' });

      const updatedLangue = await Langue.findByPk(req.params.code);
      res.status(200).json(updatedLangue);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteLangue(req, res) {
    try {
      const deleted = await Langue.destroy({ where: { Code: req.params.code } });
      if (!deleted) return res.status(404).json({ error: 'Langue non trouvée' });

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};