module.exports = (sequelize, DataTypes) => {
  const ContientEtape = sequelize.define('ContientEtape', {
    IdEtape: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    IdCourse: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'ContientEtape',
    timestamps: false
  });

  ContientEtape.associate = function(models) {
    ContientEtape.belongsTo(models.Etape, {
      foreignKey: 'IdEtape',
      as: 'etape'
    });

    ContientEtape.belongsTo(models.Course, {
      foreignKey: 'IdCourse',
      as: 'course'
    });
  };

  return ContientEtape;
};