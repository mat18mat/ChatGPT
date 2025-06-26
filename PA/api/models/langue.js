const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Langue extends Model {}

  Langue.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Langue',
    tableName: 'langue',
    timestamps: false
  });

  return Langue;
};