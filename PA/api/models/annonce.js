module.exports = (sequelize, DataTypes) => {
  const Annonce = sequelize.define('Annonce', {
    IdAnnonce: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    IdTache: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Temps: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    Debut: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Fin: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Pays: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Titre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Statut: {
      type: DataTypes.ENUM('brouillon', 'publiee', 'terminee'),
      allowNull: false
    },
    Adresse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DateSouhaitee: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    LienImage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    IdCreateur: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Annonce',
    timestamps: false
  });

  Annonce.associate = function(models) {
    Annonce.belongsTo(models.Utilisateur, {
      foreignKey: 'IdCreateur',
      as: 'createur'
    });

    Annonce.belongsTo(models.Tache, {
      foreignKey: 'IdTache',
      as: 'tache'
    });
  };

  return Annonce;
};