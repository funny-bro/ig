const fs = require('fs')

const move1stTaskFile = (fromFile, toFile) => {
  const fromString = fs.readFileSync(fromFile)
  const fromList = JSON.parse(fromString)
  const _fromList = fromList.slice(1, fromList.length)

  const toString = fs.readFileSync(toFile)
  const toList = JSON.parse(toString)
  const _toList = [
    ...toList,
    fromList[0]
  ]
  fs.writeFileSync(fromFile, JSON.stringify(_fromList))
  fs.writeFileSync(toFile, JSON.stringify(_toList))
  return
}

const getFirstTask = (from) => {
  const jsonString = fs.readFileSync(from)
  const jsonList = JSON.parse(jsonString)
  return jsonList[0]
}

module.exports ={
  move1stTaskFile,
  getFirstTask
}