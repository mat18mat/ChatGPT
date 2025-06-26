module.exports = (sequelize, DataTypes) => {
  const Commercant = sequelize.define('Commercant', {
    IdCommercant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdContrat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OptionGrossiste: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    HeureOuverture: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    NomCommerce: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    TypeCommerce: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    SIRET: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    IdEntrepot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdCourse: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Commercant',
    timestamps: false
  });

  Commercant.associate = function(models) {
    Commercant.belongsTo(models.Contrat, {
      foreignKey: 'IdContrat',
      as: 'contrat'
    });

    Commercant.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    Commercant.belongsTo(models.Entrepot, {
      foreignKey: 'IdEntrepot',
      as: 'entrepot'
    });

    Commercant.belongsTo(models.Course, {
      foreignKey: 'IdCourse',
      as: 'course'
    });
  };

  return Commercant;
};