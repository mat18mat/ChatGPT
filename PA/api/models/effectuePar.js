module.exports = (sequelize, DataTypes) => {
  const EffectuePar = sequelize.define('EffectuePar', {
    IdLivreur: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    IdCourse: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'EffectuePar',
    timestamps: false
  });

  EffectuePar.associate = function(models) {
    EffectuePar.belongsTo(models.Livreurs, {
      foreignKey: 'IdLivreur',
      as: 'livreur'
    });

    EffectuePar.belongsTo(models.Course, {
      foreignKey: 'IdCourse',
      as: 'course'
    });
  };

  return EffectuePar;
};