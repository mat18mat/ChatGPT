const express = require('express');
const router = express.Router();
const authenticateJwt = require('../middleware/authenticateJwt');
router.use(authenticateJwt);
const validate = require('../middleware/validate');
const courseController = require('../controllers/courseController');
const { courseValidator } = require('../validators/courseValidator');

// GET toutes les courses
router.get('/', courseController.getAllCourses);

// GET une course par ID
router.get('/:id', courseController.getCourseById);

// POST créer une course
router.post('/', courseValidator, validate, courseController.createCourse);

// PUT mettre à jour complètement une course
router.put('/:id', courseValidator, validate, courseController.updateCourse);

// PATCH mise à jour partielle
router.patch('/:id', courseController.patchCourse);

// DELETE une course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;