module.exports = (sequelize, DataTypes) => {
  const Abonnement = sequelize.define('Abonnement', {
    IdAbonnement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PrixMensuel: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    Assurance: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Reduction: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    LivraisonPrioritaire: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ColisOfferts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Avantages: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Recurence: {
      type: DataTypes.ENUM('Mensuel', 'Annuel'),
      allowNull: false
    },
    DateDebut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DateFin: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'Abonnement',
    timestamps: false
  });

  Abonnement.associate = function (models) {
    Abonnement.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
  };

  return Abonnement;
};