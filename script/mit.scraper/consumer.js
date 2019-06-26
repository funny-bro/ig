(async function(){
  const cmd = require('@pscraper/cmd')
  const {onlyCharDigit} = require('../../utils/string')
  const fs = require('fs')
  const taskUtils = require('./utils/task')
  const taskDir = '@mit'
  const doneTaskFilePath = `${__dirname}/../../${taskDir}/done.json`
  const taskFilePath = `${__dirname}/../../${taskDir}/task.json`

  try {
    fs.mkdirSync(`./${taskDir}/images`)

    if(!fs.existsSync(doneTaskFilePath)) {
      fs.writeFileSync(doneTaskFilePath, JSON.stringify([]))
    }
  }
  catch(err){
    console.log('[ERROR] @mit/images is existed')
  }

  const processTask = async () => {
    const task = taskUtils.getFirstTask(taskFilePath)

    if(!task) {
      return console.log('[INFO] not more task to consumer')
    }

    const {url} = task
    try{
      await cmd(`npx @pscraper/scraper --config=./script/mit.scraper/mit.download.image.js --url=${url} --taskDir=${taskDir}/images`)

      taskUtils.move1stTaskFile(taskFilePath, doneTaskFilePath)

      return processTask(`${__dirname}/../../${taskDir}/task.json`)
    }
    catch(err){
      console.log(err)
    }
  }

  await processTask()
})()