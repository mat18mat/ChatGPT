module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Prenom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Mail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    PieceIdentite: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NoteMoyenne: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Telephone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    Mdp: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Adresse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DateNaissance: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DateInscription: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LanguePreferee: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TutorielVu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Banni: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    PhotoProfil: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    JustificatifDomicile: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    QRCode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    EmailVerifie: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IdRole: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'IdRole'
      }
    }
  });

  Utilisateur.associate = function (models) {
    Utilisateur.belongsTo(models.Role, { foreignKey: 'IdRole', as: 'role' });
    Utilisateur.hasMany(models.Abonnement, { foreignKey: 'IdUtilisateur', as: 'abonnements' });
    Utilisateur.hasMany(models.Tache, { foreignKey: 'IdUtilisateur', as: 'taches' });
    Utilisateur.hasMany(models.Document, { foreignKey: 'IdUtilisateur', as: 'documents' });
    Utilisateur.hasMany(models.Log, { foreignKey: 'IdUtilisateur', as: 'logs' });
    Utilisateur.hasMany(models.Notification, { foreignKey: 'IdUtilisateur', as: 'notifications' });
    Utilisateur.hasMany(models.ZoneTravail, { foreignKey: 'IdUtilisateur', as: 'zones' });
    Utilisateur.hasMany(models.BoxStockage, { foreignKey: 'IdUtilisateur', as: 'boxes' });
    Utilisateur.hasMany(models.Recoit, { foreignKey: 'IdUtilisateur', as: 'receptions' });
    Utilisateur.hasMany(models.Facture, { foreignKey: 'IdUtilisateur', as: 'factures' });
    Utilisateur.hasMany(models.Annonce, { foreignKey: 'IdCreateur', as: 'annonces' });
    Utilisateur.hasMany(models.Course, { foreignKey: 'IdExpediteur', as: 'coursesExpediteur' });
    Utilisateur.hasMany(models.Paiement, { foreignKey: 'IdUtilisateur', as: 'paiements' });
    Utilisateur.hasMany(models.MoyenPaiement, { foreignKey: 'IdUtilisateur', as: 'moyensPaiement' });
    Utilisateur.hasMany(models.Evaluation, { foreignKey: 'IdEvalueur', as: 'evaluationsFaites' });
    Utilisateur.hasMany(models.Evaluation, { foreignKey: 'IdCible', as: 'evaluationsRecues' });
    Utilisateur.hasMany(models.Message, { foreignKey: 'IdEnvoyeur', as: 'messages' });
  };

  return Utilisateur;
};