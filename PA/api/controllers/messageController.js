const { validationResult } = require('express-validator');
const Message = require('../models').Message;

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message non trouvé' });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du message' });
  }
};

const createMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { IdConversation, IdEnvoyeur, Contenu, Lu } = req.body;

  try {
    const message = await Message.create({
      IdConversation,
      IdEnvoyeur,
      Contenu,
      Lu
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
};

const updateMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Message.update(req.body, {
      where: { IdMessage: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Message non trouvé' });
    res.status(200).json({ message: 'Message mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchMessage = async (req, res) => {
  try {
    const [updated] = await Message.update(req.body, {
      where: { IdMessage: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Message non trouvé' });
    res.status(200).json({ message: 'Message partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.destroy({ where: { IdMessage: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Message non trouvé' });
    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  patchMessage,
  deleteMessage
};