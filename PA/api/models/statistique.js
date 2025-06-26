module.exports = (sequelize, DataTypes) => {
  const Statistique = sequelize.define('Statistique', {
    IdStatistique: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TypeStatistique: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Categorie: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Valeur: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    TexteOptionnel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    IdSource: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SourceType: {
      type: DataTypes.ENUM('Utilisateur', 'Facture', 'Course', 'Annonce', 'Livreur', 'Prestataire', 'Evaluation'),
      allowNull: false
    },
    DateCalcul: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Statistique.associate = function (models) {
    models.Utilisateur.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Utilisateur' },
      as: 'statsUtilisateur'
    });
  
    models.Facture.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Facture' },
      as: 'statsFacture'
    });
  
    models.Course.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Course' },
      as: 'statsCourse'
    });
  
    models.Annonce.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Annonce' },
      as: 'statsAnnonce'
    });
  
    models.Livreurs.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Livreur' },
      as: 'statsLivreur'
    });
  
    models.Prestataire.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Prestataire' },
      as: 'statsPrestataire'
    });
  
    models.Evaluation.hasMany(Statistique, {
      foreignKey: 'IdSource',
      constraints: false,
      scope: { SourceType: 'Evaluation' },
      as: 'statsEvaluation'
    });
    tableName: 'Statistiques'
  };
  
  Statistique.prototype.getSource = async function (models) {
    switch (this.SourceType) {
      case 'Utilisateur':
        return await models.Utilisateur.findByPk(this.IdSource);
      case 'Facture':
        return await models.Facture.findByPk(this.IdSource);
      case 'Course':
        return await models.Course.findByPk(this.IdSource);
      case 'Annonce':
        return await models.Annonce.findByPk(this.IdSource);
      case 'Livreur':
        return await models.Livreurs.findByPk(this.IdSource);
      case 'Prestataire':
        return await models.Prestataire.findByPk(this.IdSource);
      case 'Evaluation':
        return await models.Evaluation.findByPk(this.IdSource);
      default:
        return null;
    }
  };

  return Statistique;
};
