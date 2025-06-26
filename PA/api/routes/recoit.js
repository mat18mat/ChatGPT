const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const recoitController = require('../controllers/recoitController');
const { recoitValidator } = require('../validators/recoitValidator');

// GET tous les liens notification-utilisateur
router.get('/', recoitController.getAllRecoit);

// GET spécifique par Notification et Utilisateur
router.get('/:IdNotification/:IdUtilisateur', recoitController.getRecoitByIds);

// POST créer un lien
router.post('/', recoitValidator, validate, recoitController.createRecoit);

// DELETE
router.delete('/:IdNotification/:IdUtilisateur', recoitController.deleteRecoit);

module.exports = router;