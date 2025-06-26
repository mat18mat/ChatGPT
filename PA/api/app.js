require('dotenv').config();
const { FRONT_OFFICE_URL, BACK_OFFICE_URL } = require('./env');
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const compression   = require('compression');
const rateLimit     = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean      = require('xss-clean');
const morgan        = require('morgan');

const authenticateJwt = require('./middleware/authenticateJwt');
const { errorHandler }    = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFound');

const utilisateur     = require('./routes/utilisateur');
const abonnement      = require('./routes/abonnement');
const annonce         = require('./routes/annonce');
const boxStockage     = require('./routes/boxStockage');
const boxAccess       = require('./routes/boxAccess');
const colis           = require('./routes/colis');
const commercant      = require('./routes/commercant');
const contrat         = require('./routes/contrat');
const course          = require('./routes/course');
const entrepot        = require('./routes/entrepot');
const etape           = require('./routes/etape');
const evaluation      = require('./routes/evaluation');
const facture         = require('./routes/facture');
const livreur         = require('./routes/livreur');
const logRouter       = require('./routes/log');
const notification    = require('./routes/notification');
const paiement        = require('./routes/paiement');
const prestataire     = require('./routes/prestataire');
const role            = require('./routes/role');
const statistique     = require('./routes/statistique');
const tache           = require('./routes/tache');
const zoneTravail     = require('./routes/zoneTravail');
const moyenPaiement   = require('./routes/moyenPaiement');
const documentRouter  = require('./routes/document');
const mediaAnnonce    = require('./routes/mediaAnnonce');
const conversation    = require('./routes/conversation');
const messageRouter   = require('./routes/message');
const langue          = require('./routes/langue');

const contientEtape    = require('./routes/contientEtape');
const effectuePar     = require('./routes/effectuePar');
const recoit          = require('./routes/recoit');
const roleUtilisateur = require('./routes/roleUtilisateur');

const app = express();

app.use(morgan('combined'));
app.use(helmet());
app.use(cors({
  origin: [FRONT_OFFICE_URL, BACK_OFFICE_URL],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xssClean());
app.use(mongoSanitize());

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, réessayez après 15 minutes'
}));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/api/utilisateurs', utilisateur);
app.use('/api/abonnements',       authenticateJwt, abonnement);
app.use('/api/annonces',          authenticateJwt, annonce);
app.use('/api/boxStockages',      authenticateJwt, boxStockage);
app.use('/api/boxAccess',         authenticateJwt, boxAccess);
app.use('/api/colis',             authenticateJwt, colis);
app.use('/api/commercants',       authenticateJwt, commercant);
app.use('/api/contrats',          authenticateJwt, contrat);
app.use('/api/courses',           authenticateJwt, course);
app.use('/api/entrepots',         authenticateJwt, entrepot);
app.use('/api/etapes',            authenticateJwt, etape);
app.use('/api/evaluations',       authenticateJwt, evaluation);
app.use('/api/factures',          authenticateJwt, facture);
app.use('/api/livreurs',          authenticateJwt, livreur);
app.use('/api/logs',              authenticateJwt, logRouter);
app.use('/api/notifications',     authenticateJwt, notification);
app.use('/api/paiements',         authenticateJwt, paiement);
app.use('/api/prestataires',      authenticateJwt, prestataire);
app.use('/api/roles',             authenticateJwt, role);
app.use('/api/statistiques',      authenticateJwt, statistique);
app.use('/api/taches',            authenticateJwt, tache);
app.use('/api/zoneTravails',      authenticateJwt, zoneTravail);
app.use('/api/moyenPaiements',    authenticateJwt, moyenPaiement);
app.use('/api/documents',         authenticateJwt, documentRouter);
app.use('/api/mediaAnnonces',     authenticateJwt, mediaAnnonce);
app.use('/api/conversations',     authenticateJwt, conversation);
app.use('/api/messages',          authenticateJwt, messageRouter);
app.use('/api/langues',           authenticateJwt, langue);

app.use('/api/contientEtapes',       authenticateJwt, contientEtape);
app.use('/api/effectuePars',         authenticateJwt, effectuePar);
app.use('/api/recoits',              authenticateJwt, recoit);
app.use('/api/roleUtilisateurs',     authenticateJwt, roleUtilisateur);

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne' })
})

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;