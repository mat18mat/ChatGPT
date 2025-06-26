module.exports = (sequelize, DataTypes) => {
  const Facture = sequelize.define('Facture', {
    IdFacture: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    MontantTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    DateCreation: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    LienPDF: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdAbonnement: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Facture',
    timestamps: false
  });

  Facture.associate = function(models) {
    Facture.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    Facture.belongsTo(models.Abonnement, {
      foreignKey: 'IdAbonnement',
      as: 'abonnement'
    });
  };

  return Facture;
};