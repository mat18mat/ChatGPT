const express = require('express');
const router = express.Router();
const langueController = require('../controllers/langueController');

router.post('/', langueController.createLangue);
router.get('/', langueController.getLangues);
router.get('/:code', langueController.getLangueByCode);
router.put('/:code', langueController.updateLangue);
router.delete('/:code', langueController.deleteLangue);

module.exports = router;