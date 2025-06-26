module.exports = (sequelize, DataTypes) => {
    const MediaAnnonce = sequelize.define('MediaAnnonce', {
      IdMedia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      IdAnnonce: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      LienMedia: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'MediaAnnonce',
      timestamps: false
    });
  
    MediaAnnonce.associate = function(models) {
      MediaAnnonce.belongsTo(models.Annonce, {
        foreignKey: 'IdAnnonce',
        as: 'annonce'
      });
    };
  
    return MediaAnnonce;
  };  