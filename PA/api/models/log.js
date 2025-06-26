module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    IdLog: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lAction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    IP: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    NavigateurAppareil: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateur',
        key: 'IdUtilisateur',
      },
    },
  }, {
    tableName: 'LOG',
    freezeTableName: true,
    timestamps: false,
  });

  Log.associate = function (models) {
    Log.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur',
    });
  };

  return Log;
};