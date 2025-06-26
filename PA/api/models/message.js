module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
      IdMessage: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      IdConversation: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      IdEnvoyeur: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Contenu: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      DateEnvoi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      Lu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'Message',
      timestamps: false
    });
  
    Message.associate = function(models) {
      Message.belongsTo(models.Utilisateur, {
        foreignKey: 'IdEnvoyeur',
        as: 'envoyeur'
      });
      Message.belongsTo(models.Conversation, {
        foreignKey: 'IdConversation',
        as: 'conversation'
      });
    };
  
    return Message;
  };  