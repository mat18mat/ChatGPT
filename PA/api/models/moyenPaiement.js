module.exports = (sequelize, DataTypes) => {
    const MoyenPaiement = sequelize.define('MoyenPaiement', {
      IdMoyenPaiement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      IdUtilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TypePaiement: {
        type: DataTypes.ENUM('Carte', 'IBAN'),
        allowNull: false
      },
      Informations: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ParDefaut: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      DateAjout: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'MoyenPaiement',
      timestamps: false
    });
  
    MoyenPaiement.associate = function(models) {
      MoyenPaiement.belongsTo(models.Utilisateur, {
        foreignKey: 'IdUtilisateur',
        as: 'utilisateur'
      });
    };
  
    return MoyenPaiement;
  };  