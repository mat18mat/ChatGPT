const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Utilisateur = require('../models').Utilisateur;
const { sendMail } = require('../utils/mailer');
const crypto = require('crypto');

// Stockage temporaire des codes 2FA (à remplacer par Redis ou BDD en prod)
const codes2FA = {};

const getAllUtilisateurs = async (req, res, next) => {
  try {
    const utilisateurs = await Utilisateur.findAll();
    res.status(200).json(utilisateurs);
  } catch (err) {
    next(err);
  }
};

const getUtilisateurById = async (req, res, next) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(utilisateur);
  } catch (err) {
    next(err);
  }
};

const createUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  try {
    const {
      Nom,
      Prenom,
      Mail,
      PieceIdentite,
      NoteMoyenne,
      Telephone,
      Mdp,
      Adresse,
      DateNaissance,
      DateInscription,
      LanguePreferee,
      TutorielVu,
      Banni,
      PhotoProfil,
      JustificatifDomicile,
      QRCode,
      IdRole
    } = req.body;

    const hash = await bcrypt.hash(Mdp, 10);

    const utilisateur = await Utilisateur.create({
      Nom,
      Prenom,
      Mail,
      PieceIdentite,
      NoteMoyenne,
      Telephone,
      Mdp: hash,
      Adresse,
      DateNaissance,
      DateInscription,
      LanguePreferee,
      TutorielVu,
      Banni,
      PhotoProfil,
      JustificatifDomicile,
      QRCode,
      IdRole
    });

    res.status(201).json(utilisateur);
  } catch (err) {
    next(err);
  }
};

const updateUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  try {
    let sendPasswordMail = false;
    if (req.body.Mdp) {
      req.body.Mdp = await bcrypt.hash(req.body.Mdp, 10);
      sendPasswordMail = true;
    }

    const [updated] = await Utilisateur.update(req.body, {
      where: { IdUtilisateur: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (sendPasswordMail) {
      await sendMail({
        to: utilisateur.Mail,
        subject: 'Votre mot de passe a été modifié',
        html: `<p>Bonjour,<br>Votre mot de passe EcoDeli a bien été modifié. Si ce n'est pas vous, contactez le support immédiatement.</p>`
      });
    }
    res.status(200).json(utilisateur);
  } catch (err) {
    next(err);
  }
};

const patchUtilisateur = async (req, res, next) => {
  try {
    if (req.body.Mdp) {
      req.body.Mdp = await bcrypt.hash(req.body.Mdp, 10);
    }

    const [updated] = await Utilisateur.update(req.body, {
      where: { IdUtilisateur: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const utilisateur = await Utilisateur.findByPk(req.params.id);
    res.status(200).json(utilisateur);
  } catch (err) {
    next(err);
  }
};

const deleteUtilisateur = async (req, res, next) => {
  try {
    const deleted = await Utilisateur.destroy({
      where: { IdUtilisateur: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const registerUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  try {
    const { Nom, Prenom, Mail, Mdp } = req.body;
    const hash = await bcrypt.hash(Mdp, 10);
    const emailToken = crypto.randomBytes(32).toString('hex');
    const user = await Utilisateur.create({
      Nom,
      Prenom,
      Mail,
      Mdp: hash,
      DateInscription: new Date(),
      EmailVerifie: false,
      EmailToken: emailToken
    });
    const confirmUrl = `${process.env.FRONT_OFFICE_URL || 'http://localhost:80'}/confirm-email?token=${emailToken}&mail=${encodeURIComponent(Mail)}`;
    await sendMail({
      to: Mail,
      subject: 'Confirmez votre adresse mail EcoDeli',
      html: `<p>Bienvenue sur EcoDeli !<br>Merci de confirmer votre adresse mail en cliquant sur ce lien : <a href="${confirmUrl}">Confirmer mon mail</a></p>`
    });
    const token = jwt.sign(
      { sub: user.IdUtilisateur },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

const loginUtilisateur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => e.msg) });
  }

  try {
    const { mail, Mdp } = req.body;
    const utilisateur = await Utilisateur.findOne({
      where: { Mail: mail }
    });

    if (!utilisateur || !(await bcrypt.compare(Mdp, utilisateur.Mdp))) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = jwt.sign(
      { sub: utilisateur.IdUtilisateur },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const send2FACode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes2FA[email] = { code, expires: Date.now() + 10 * 60 * 1000 }; // 10 min

  await sendMail({
    to: email,
    subject: 'Votre code de vérification EcoDeli',
    html: `<p>Votre code de vérification est : <b>${code}</b></p>`
  });

  res.json({ success: true });
};

const verify2FACode = (req, res) => {
  const { email, code } = req.body;
  const entry = codes2FA[email];
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(400).json({ error: 'Code invalide ou expiré' });
  }
  delete codes2FA[email];
  res.json({ success: true });
};

const confirmEmail = async (req, res) => {
  const { token, mail } = req.query;
  if (!token || !mail) return res.status(400).json({ error: 'Token ou mail manquant' });
  const user = await Utilisateur.findOne({ where: { Mail: mail, EmailToken: token } });
  if (!user) return res.status(400).json({ error: 'Lien invalide' });
  user.EmailVerifie = true;
  user.EmailToken = null;
  await user.save();
  res.json({ success: true, message: 'Email vérifié avec succès' });
};

module.exports = {
  getAllUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  patchUtilisateur,
  deleteUtilisateur,
  registerUtilisateur,
  loginUtilisateur,
  send2FACode,
  verify2FACode,
  confirmEmail
};