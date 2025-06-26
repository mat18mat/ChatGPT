module.exports = (sequelize, DataTypes) => {
  const Paiement = sequelize.define('Paiement', {
    IdPaiement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    TypePaiement: {
      type: DataTypes.ENUM('Mensuel', 'Sur Place'),
      allowNull: false
    },
    DatePaiement: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Statut: {
      type: DataTypes.ENUM('Effectue', 'En Attente', 'Echoue'),
      allowNull: false
    },
    IdFacture: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdMoyenPaiement: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Paiement',
    timestamps: false
  });

  Paiement.associate = function(models) {
    Paiement.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    Paiement.belongsTo(models.Facture, {
      foreignKey: 'IdFacture',
      as: 'facture'
    });

    Paiement.belongsTo(models.MoyenPaiement, {
      foreignKey: 'IdMoyenPaiement',
      as: 'moyenPaiement'
    });
  };

  return Paiement;
};