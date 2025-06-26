module.exports = (sequelize, DataTypes) => {
    const BoxAccess = sequelize.define('BoxAccess', {
      IdAccess: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      IdBox: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      EmailInvite: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      TypeAcces: {
        type: DataTypes.ENUM('lecture', 'complet'),
        allowNull: false
      }
    }, {
      tableName: 'BoxAccess',
      timestamps: false
    });
  
    BoxAccess.associate = function(models) {
      BoxAccess.belongsTo(models.BoxStockage, {
        foreignKey: 'IdBox',
        as: 'box'
      });
    };
  
    return BoxAccess;
  };  