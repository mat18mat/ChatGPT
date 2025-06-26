module.exports = (sequelize, DataTypes) => {
  const ZoneTravail = sequelize.define('ZoneTravail', {
    IdZoneTravail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Pays: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Ville: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'ZoneTravail',
    timestamps: false
  });

  ZoneTravail.associate = function(models) {
    ZoneTravail.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
  };

  return ZoneTravail;
};