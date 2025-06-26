const { validationResult } = require('express-validator');
const Course = require('../models').Course;

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course non trouvée' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la course' });
  }
};

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    Debut,
    Fin,
    Valide,
    Prix,
    Description,
    AdresseDepart,
    AdresseArrivee,
    Statut,
    IdLivreur,
    IdExpediteur
  } = req.body;

  try {
    const course = await Course.create({
      Debut,
      Fin,
      Valide,
      Prix,
      Description,
      AdresseDepart,
      AdresseArrivee,
      Statut,
      IdLivreur,
      IdExpediteur
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la course' });
  }
};

const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Course.update(req.body, {
      where: { IdCourse: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Course non trouvée' });
    res.status(200).json({ message: 'Course mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la course' });
  }
};

const patchCourse = async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { IdCourse: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Course non trouvée' });
    res.status(200).json({ message: 'Course partiellement mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.destroy({ where: { IdCourse: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Course non trouvée' });
    res.status(200).json({ message: 'Course supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la course' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  patchCourse,
  deleteCourse
};