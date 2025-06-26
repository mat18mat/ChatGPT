const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
const validate = require('../middleware/validate');
const utilisateurController = require('../controllers/utilisateurController');
const {utilisateurValidator} = require('../validators/utilisateurValidator');
const loginValidator = require('../validators/loginValidator');

// LOGIN + REGISTER + LOGOUT
router.post('/register', utilisateurValidator,utilisateurController.registerUtilisateur);
router.post('/login', loginValidator, validate, utilisateurController.loginUtilisateur);

router.use(authenticateJwt);

// GET tous les utilisateurs
router.get('/', utilisateurController.getAllUtilisateurs);

// GET un utilisateur par ID
router.get('/:id', utilisateurController.getUtilisateurById);

// POST créer une utilisateur
router.post('/', utilisateurValidator, validate, utilisateurController.createUtilisateur);

// PUT (remplacement complet)
router.put('/:id', utilisateurValidator, validate, utilisateurController.updateUtilisateur);

// PATCH (mis à jour partielle)
router.patch('/:id', utilisateurController.patchUtilisateur);

// DELETEE un utilisateur
router.delete('/:id', utilisateurController.deleteUtilisateur);

router.post('/send-2fa', utilisateurController.send2FACode);
router.post('/verify-2fa', utilisateurController.verify2FACode);

router.get('/confirm-email', utilisateurController.confirmEmail);

module.exports = router;