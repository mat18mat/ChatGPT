const { body } = require('express-validator');

const utilisateurValidator = [
  body('Nom')
    .notEmpty().withMessage('Le nom est requis')
    .isString().withMessage('Le nom doit être une chaîne de caractères'),
  body('Prenom')
    .notEmpty().withMessage('Le prénom est requis')
    .isString().withMessage('Le prénom doit être une chaîne de caractères'),
  body('Mail')
    .isEmail().withMessage('Email invalide'),
  body('Telephone')
    .notEmpty().withMessage('Le téléphone est requis')
    .isString().withMessage('Le téléphone doit être une chaîne de caractères'),
  body('Mdp')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isString().withMessage('Le mot de passe doit être une chaîne de caractères'),
  body('DateNaissance')
    .optional()
    .isISO8601().withMessage('Date de naissance invalide'),
  body('DateInscription')
    .optional()
    .isISO8601().withMessage('Date d\'inscription invalide'),
  body('LanguePreferee')
    .optional()
    .isString().withMessage('La langue préférée doit être une chaîne de caractères'),
  body('TutorielVu')
    .optional()
    .isBoolean().withMessage('TutorielVu doit être un booléen'),
  body('Banni')
    .optional()
    .isBoolean().withMessage('Banni doit être un booléen'),
  body('NoteMoyenne')
    .optional()
    .isFloat().withMessage('NoteMoyenne doit être un nombre'),
  body('IdRole')
    .optional()
    .isInt().withMessage('IdRole doit être un entier'),
  body('PhotoProfil')
    .optional()
    .isString().withMessage('PhotoProfil doit être une chaîne de caractères'),
  body('JustificatifDomicile')
    .optional()
    .isString().withMessage('JustificatifDomicile doit être une chaîne de caractères'),
  body('QRCode')
    .optional()
    .isString().withMessage('QRCode doit être une chaîne de caractères'),
  body('Adresse')
    .optional()
    .isString().withMessage('Adresse doit être une chaîne de caractères'),
  body('PieceIdentite')
    .optional()
    .isString().withMessage('PieceIdentite doit être une chaîne de caractères'),
];

module.exports = {
  utilisateurValidator
};