const { validationResult } = require('express-validator');
const Notification = require('../models').Notification;
const { sendMail } = require('../utils/mailer');

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la notification' });
  }
};

const createNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    Message,
    Date,
    Lu,
    Type,
    IdUtilisateur
  } = req.body;

  try {
    const notification = await Notification.create({
      Message,
      Date,
      Lu,
      Type,
      IdUtilisateur
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la notification' });
  }
};

const updateNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Notification.update(req.body, {
      where: { IdNotification: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json({ message: 'Notification mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchNotification = async (req, res) => {
  try {
    const [updated] = await Notification.update(req.body, {
      where: { IdNotification: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json({ message: 'Notification partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({ where: { IdNotification: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

const sendNotificationMail = async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await sendMail({ to, subject, html });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erreur lors de l'envoi du mail" });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  patchNotification,
  deleteNotification,
  sendNotificationMail
};