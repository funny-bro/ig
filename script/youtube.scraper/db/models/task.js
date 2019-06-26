const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('task', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      sourceId: {
        type: type.STRING,
        allowNull: false
      },
      type: {
        type: type.STRING,
        allowNull: false
      },      
      title: {
        type: type.STRING,
        allowNull: false
      },      
      description: {
        type: type.STRING,
        allowNull: false
      },      
      sourceUrl: {
        type: type.STRING,
        allowNull: false
      },      
      downloadUrl: {
        type: type.STRING,
        allowNull: false,
      },     
      status: {
        type: type.STRING,
        allowNull: false,
      }
  })
}