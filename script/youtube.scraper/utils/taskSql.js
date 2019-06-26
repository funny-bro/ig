const { Task } = require('../db')
const STATUS_CREATED = 'CREATED'
const STATUS_FINISHED = 'FINISHED'

const skipOrCreate = (sourceId = {}, payload = {}) => new Promise((resolve, reject)=>{
  return Task.findOne({where: {sourceId}})
    .then((res)=>{
      if(!res) {
        console.log(`[INFO] creating task : ${sourceId}`)
        return Task.create({...payload, status: STATUS_CREATED})
      } else {
        console.log(`[INFO] task existed skip: ${sourceId}`)
        return 
      }
    }).then((res)=>{
      resolve(res)
    })
})

const getFirstTask = () => {
  return Task.findOne({where: {status: STATUS_CREATED}})
}

const finishedTask = (id) => {
  return Task.update({status: STATUS_FINISHED}, {where: {id}})
}

module.exports ={
  getFirstTask,
  skipOrCreate,
  finishedTask
}