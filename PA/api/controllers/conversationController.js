const { validationResult } = require('express-validator');
const Conversation = require('../models').Conversation;

const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll();
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};

const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation non trouvée' });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la conversation' });
  }
};

const createConversation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { Sujet } = req.body;

  try {
    const conversation = await Conversation.create({ Sujet });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
};

const updateConversation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Conversation.update(req.body, {
      where: { IdConversation: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Conversation non trouvée' });
    res.status(200).json({ message: 'Conversation mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchConversation = async (req, res) => {
  try {
    const [updated] = await Conversation.update(req.body, {
      where: { IdConversation: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Conversation non trouvée' });
    res.status(200).json({ message: 'Conversation partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const deleted = await Conversation.destroy({ where: { IdConversation: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Conversation non trouvée' });
    res.status(200).json({ message: 'Conversation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la conversation' });
  }
};

module.exports = {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  patchConversation,
  deleteConversation
};