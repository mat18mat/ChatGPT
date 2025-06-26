module.exports = (sequelize, DataTypes) => {
  const Recoit = sequelize.define('Recoit', {
    IdNotification: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Notification',
        key: 'IdNotification'
      }
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Utilisateur',
        key: 'IdUtilisateur'
      }
    }
  }, {
    tableName: 'Recoit',
    timestamps: false
  });

  Recoit.associate = function(models) {
    Recoit.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
    Recoit.belongsTo(models.Notification, {
      foreignKey: 'IdNotification',
      as: 'notification'
    });
  };

  return Recoit;
};