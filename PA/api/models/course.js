module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    IdCourse: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Debut: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Valide: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AdresseDepart: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AdresseArrivee: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Statut: {
      type: DataTypes.ENUM('en attente', 'en cours', 'livree'),
      allowNull: false
    },
    IdLivreur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IdExpediteur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Course',
    timestamps: false
  });

  Course.associate = function(models) {
    Course.belongsTo(models.Livreurs, {
      foreignKey: 'IdLivreur',
      as: 'livreur'
    });

    Course.belongsTo(models.Utilisateur, {
      foreignKey: 'IdExpediteur',
      as: 'expediteur'
    });
  };

  return Course;
};