module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    IdEvaluation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Note: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Commentaire: {
      type: DataTypes.TEXT
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TypeDestinataire: {
      type: DataTypes.ENUM('Prestataire', 'Livreur', 'Commercant', 'Utilisateur'),
      allowNull: false
    },
    IdCible: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdEvalueur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Evaluation',
    timestamps: false
  });

  Evaluation.associate = function(models) {
    Evaluation.belongsTo(models.Utilisateur, {
      foreignKey: 'IdEvalueur',
      as: 'evalueur'
    });

    // Associations polymorphiques simulées
    models.Prestataire.hasMany(Evaluation, {
      foreignKey: 'IdCible',
      constraints: false,
      scope: {
        TypeDestinataire: 'Prestataire'
      },
      as: 'evaluationsPrestataire'
    });

    models.Livreurs.hasMany(Evaluation, {
      foreignKey: 'IdCible',
      constraints: false,
      scope: {
        TypeDestinataire: 'Livreur'
      },
      as: 'evaluationsLivreur'
    });

    models.Commercant.hasMany(Evaluation, {
      foreignKey: 'IdCible',
      constraints: false,
      scope: {
        TypeDestinataire: 'Commercant'
      },
      as: 'evaluationsCommercant'
    });

    models.Utilisateur.hasMany(Evaluation, {
      foreignKey: 'IdCible',
      constraints: false,
      scope: {
        TypeDestinataire: 'Utilisateur'
      },
      as: 'evaluationsUtilisateur'
    });
  };

  Evaluation.prototype.getCible = async function(models) {
    switch (this.TypeDestinataire) {
      case 'Prestataire':
        return await models.Prestataire.findByPk(this.IdCible);
      case 'Livreur':
        return await models.Livreurs.findByPk(this.IdCible);
      case 'Commercant':
        return await models.Commercant.findByPk(this.IdCible);
      case 'Utilisateur':
        return await models.Utilisateur.findByPk(this.IdCible);
      default:
        return null;
    }
  };

  return Evaluation;
};