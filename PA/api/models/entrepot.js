module.exports = (sequelize, DataTypes) => {
  const Entrepot = sequelize.define('Entrepot', {
    IdEntrepot: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Localisation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Secteur: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Capacite: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Entrepot.associate = function(models) {
    Entrepot.hasMany(models.BoxStockage, {
      foreignKey: 'IdEntrepot',
      as: 'boxStockages'
    });

    Entrepot.hasMany(models.Commercant, {
      foreignKey: 'IdEntrepot',
      as: 'commercants'
    });
  };

  return Entrepot;
};