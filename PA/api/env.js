require('dotenv').config();

const required = [
  'PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'JWT_SECRET',
  'FRONT_OFFICE_URL',
  'BACK_OFFICE_URL'
];

const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`Variables d'environnement manquantes : ${missing.join(', ')}`);
  process.exit(1);
}

// SMTP configuration for nodemailer (à compléter dans votre environnement)
// process.env.SMTP_HOST = 'smtp.example.com';
// process.env.SMTP_PORT = '587';
// process.env.SMTP_USER = 'votre_user';
// process.env.SMTP_PASS = 'votre_mot_de_passe';

module.exports = {
  PORT: process.env.PORT || 4000,
  DB: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  FRONT_OFFICE_URL: process.env.FRONT_OFFICE_URL || "http://localhost:8082",
  BACK_OFFICE_URL: process.env.BACK_OFFICE_URL || "http://localhost:81"
};