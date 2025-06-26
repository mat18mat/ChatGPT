module.exports = (sequelize, DataTypes) => {
  const Prestataire = sequelize.define('Prestataire', {
    IdPrestataire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    OptionGrossiste: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Habilitations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Tarifs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Approuve: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    IdAnnonce: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdContrat: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Prestataire',
    timestamps: false
  });

  Prestataire.associate = function(models) {
    Prestataire.belongsTo(models.Annonce, {
      foreignKey: 'IdAnnonce',
      as: 'annonce'
    });

    Prestataire.belongsTo(models.Contrat, {
      foreignKey: 'IdContrat',
      as: 'contrat'
    });
  };

  return Prestataire;
};