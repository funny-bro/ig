const Sequelize = require('sequelize')
const config = require('./config')
const TaskModel = require('./models/task')

const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  query:{
    raw:true,
  },
  logging: (config && config.logging) || false,
});

const Task = TaskModel(sequelize, Sequelize)
// const connect = () => sequelize.sync({ force: true })
const connect = () => sequelize.sync()
.then(() => {
  console.log(`Database & tables created!`)
})

module.exports = {
  connect,
  Task,
}