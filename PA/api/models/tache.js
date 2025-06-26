module.exports = (sequelize, DataTypes) => {
  const Tache = sequelize.define('Tache', {
    IdTache: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Temps: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Debut: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    DateJour: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Tache',
    timestamps: false
  });

  Tache.associate = function (models) {
    Tache.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });

    Tache.hasMany(models.Annonce, {
      foreignKey: 'IdTache',
      as: 'annonces'
    });
  };

  return Tache;
};