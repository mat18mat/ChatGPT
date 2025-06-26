module.exports = (sequelize, DataTypes) => {
  const Contrat = sequelize.define('Contrat', {
    IdContrat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TypeContrat: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Debut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Remuneration: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    MethodeRemuneration: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Statut: {
      type: DataTypes.ENUM('en attente', 'actif', 'refuse', 'terminee'),
      allowNull: false
    },
    IdContracteur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdDemandeur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LienPDF: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Template: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Contrat.associate = function (models) {
    Contrat.belongsTo(models.Utilisateur, {
      foreignKey: 'IdContracteur',
      as: 'contracteur'
    });
    Contrat.belongsTo(models.Utilisateur, {
      foreignKey: 'IdDemandeur',
      as: 'demandeur'
    });
  };

  return Contrat;
};