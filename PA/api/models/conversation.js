module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
      IdConversation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Sujet: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      DateCreation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'Conversation',
      timestamps: false
    });
  
    Conversation.associate = function(models) {
      Conversation.hasMany(models.Message, {
        foreignKey: 'IdConversation',
        as: 'messages'
      });
    };
  
    return Conversation;
  };  