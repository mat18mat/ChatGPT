module.exports = (sequelize, DataTypes) => {
  const BoxStockage = sequelize.define('BoxStockage', {
    IdBox: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdEntrepot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DateDebut: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    DateFin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Taille: {
      type: DataTypes.ENUM('petite', 'moyenne', 'grande'),
      allowNull: false
    },
    TypeBox: {
      type: DataTypes.ENUM('standard', 'temperee'),
      allowNull: false
    },
    Statut: {
      type: DataTypes.ENUM('active', 'terminee', 'en attente'),
      allowNull: false
    },
    Assurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'BoxStockage',
    timestamps: false
  });

  BoxStockage.associate = function(models) {
    BoxStockage.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    BoxStockage.belongsTo(models.Entrepot, {
      foreignKey: 'IdEntrepot',
      as: 'entrepot'
    });
  };

  return BoxStockage;
};