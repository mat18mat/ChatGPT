module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    IdDocument: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    IdUtilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Utilisateur',
        key: 'IdUtilisateur'
      }
    },
    TypeDocument: {
      type: DataTypes.ENUM(
        'Identite',
        'Justificatif',
        'Permis',
        'Assurance',
        'Diplome',
        'KBIS'
      ),
      allowNull: false
    },
    Fichier: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DateAjout: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  Document.associate = function(models) {
    Document.belongsTo(models.Utilisateur, {
      foreignKey: 'IdUtilisateur',
      as: 'utilisateur'
    });
  };

  return Document;
};