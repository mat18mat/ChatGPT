module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    IdNotification: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Notification.associate = function (models) {
    Notification.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
  };

  return Notification;
};