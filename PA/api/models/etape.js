module.exports = (sequelize, DataTypes) => {
  const Etape = sequelize.define('Etape', {
    IdEtape: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TempsDebut: {
      type: DataTypes.TIME,
      allowNull: true
    },
    TempsFin: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Nom: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Debut: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Fin: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Valide: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  Etape.associate = function (models) {
    Etape.belongsToMany(models.Course, {
      through: 'ContientEtape',
      foreignKey: 'IdEtape',
      otherKey: 'IdCourse',
      as: 'courses'
    });
  };

  return Etape;
};