module.exports = (sequelize, DataTypes) => {
  const RoleUtilisateur = sequelize.define('RoleUtilisateur', {
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    IdRole: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false,
    tableName: 'RoleUtilisateur'
  });

  RoleUtilisateur.associate = function (models) {
    RoleUtilisateur.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
    RoleUtilisateur.belongsTo(models.Role, {
      foreignKey: 'IdRole',
      as: 'role'
    });
  };

  return RoleUtilisateur;
};