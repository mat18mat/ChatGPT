module.exports = (sequelize, DataTypes) => {
  const Livreurs = sequelize.define('Livreurs', {
    IdLivreur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    OptionGrossiste: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Vehicule: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdContrat: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Livreurs',
    timestamps: false
  });

  Livreurs.associate = function (models) {
    Livreurs.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    Livreurs.belongsTo(models.Contrat, {
      foreignKey: 'IdContrat',
      as: 'contrat'
    });

    Livreurs.hasMany(models.Course, {
      foreignKey: 'IdLivreur',
      as: 'courses'
    });
  };

  return Livreurs;
};