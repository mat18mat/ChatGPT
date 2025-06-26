module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    IdRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nom: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    }
  });

  Role.associate = function(models) {
    Role.hasMany(models.Utilisateur, {
      foreignKey: 'IdRole',
      as: 'utilisateurs'
    });
  };

  return Role;
};