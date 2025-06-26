const { validationResult } = require('express-validator');
const Contrat = require('../models').Contrat;

const getAllContrats = async (req, res) => {
  try {
    const contrats = await Contrat.findAll();
    res.status(200).json(contrats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
  }
};

const getContratById = async (req, res) => {
  try {
    const contrat = await Contrat.findByPk(req.params.id);
    if (!contrat) return res.status(404).json({ message: 'Contrat non trouvé' });
    res.status(200).json(contrat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du contrat' });
  }
};

const createContrat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    TypeContrat,
    Debut,
    Fin,
    Remuneration,
    MethodeRemuneration,
    Description,
    Statut,
    IdContracteur,
    IdDemandeur,
    LienPDF,
    Template
  } = req.body;

  try {
    const contrat = await Contrat.create({
      TypeContrat,
      Debut,
      Fin,
      Remuneration,
      MethodeRemuneration,
      Description,
      Statut,
      IdContracteur,
      IdDemandeur,
      LienPDF,
      Template
    });
    res.status(201).json(contrat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du contrat' });
  }
};

const updateContrat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Contrat.update(req.body, {
      where: { IdContrat: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Contrat non trouvé' });
    res.status(200).json({ message: 'Contrat mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const patchContrat = async (req, res) => {
  try {
    const [updated] = await Contrat.update(req.body, {
      where: { IdContrat: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Contrat non trouvé' });
    res.status(200).json({ message: 'Contrat partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle' });
  }
};

const deleteContrat = async (req, res) => {
  try {
    const deleted = await Contrat.destroy({ where: { IdContrat: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Contrat non trouvé' });
    res.status(200).json({ message: 'Contrat supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du contrat' });
  }
};

module.exports = {
  getAllContrats,
  getContratById,
  createContrat,
  updateContrat,
  patchContrat,
  deleteContrat
};