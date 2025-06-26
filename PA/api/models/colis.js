module.exports = (sequelize, DataTypes) => {
  const Colis = sequelize.define('Colis', {
    IdColis: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Description: {
      type: DataTypes.TEXT
    },
    Dimensions: {
      type: DataTypes.TEXT
    },
    IdDestinataire: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IdCourse: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Colis',
    timestamps: false
  });

  Colis.associate = function(models) {
    Colis.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'expediteur'
    });

    Colis.belongsTo(models.Utilisateur, {
      foreignKey: 'IdDestinataire',
      as: 'destinataire'
    });

    Colis.belongsTo(models.Course, {
      foreignKey: 'IdCourse',
      as: 'course'
    });
  };

  return Colis;
};