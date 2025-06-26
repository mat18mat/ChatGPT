const { validationResult } = require('express-validator');
const Document = require('../models').Document;

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document non trouvé' });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du document' });
  }
};

const createDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { IdUtilisateur, TypeDocument, Fichier } = req.body;

  try {
    const document = await Document.create({
      IdUtilisateur,
      TypeDocument,
      Fichier
    });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du document' });
  }
};

const updateDocument = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const [updated] = await Document.update(req.body, {
      where: { IdDocument: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Document non trouvé' });
    res.status(200).json({ message: 'Document mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du document' });
  }
};

const patchDocument = async (req, res) => {
  try {
    const [updated] = await Document.update(req.body, {
      where: { IdDocument: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: 'Document non trouvé' });
    res.status(200).json({ message: 'Document partiellement mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle du document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.destroy({ where: { IdDocument: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Document non trouvé' });
    res.status(200).json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du document' });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  patchDocument,
  deleteDocument
};