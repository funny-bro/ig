(async function(){
  const translateApi = require('../../apis/translate')

  const {onlyCharDigit} = require('../../utils/string')
  const fs = require('fs')
  const db = require('../../utils/taskSql/db')
  const taskSql = require('../../utils/taskSql')

  const { argv } = require('optimist')
  const projectName = argv.projectName || `googleArt${(new Date().getTime())}`
  const taskDir = `@${projectName}`

  const sleep = (s = 3) => new Promise((resolve)=> setTimeout(resolve, s*1000))

  const _translateApi = async (str) => {
    try {
      const result = await translateApi(str)
      return result
    }
    catch(err){
      return ''
    }
  }

  const translateInfo = async (info) => {
    const {title, descriptionPage, type, medium, description, creator } = info
    const zhTitle = await _translateApi(title)
    await sleep(2)
    const zhDescriptionPage = await _translateApi(descriptionPage)
    await sleep(2)
    const zhType = await _translateApi(type)
    await sleep(2)
    const zhMedium = await _translateApi(medium)
    await sleep(2)
    const zhDescription = await _translateApi(description)
    await sleep(2)
    const zhCreator = await _translateApi(creator)
    await sleep(2)
    
    return {
      zhTitle,
      zhDescriptionPage,
      zhType,
      zhMedium,
      zhDescription,
      zhCreator,
      ...info,
    }
  }

  const downloadFileFromUrl = (url, path) => {
    const https = require('https');
    const file = fs.createWriteStream(path);
    const request = https.get(url, function(response) {
      response.pipe(file);
    });
  }

  try {
    await db.connect()
    fs.mkdirSync(`./${taskDir}`)
  }
  catch(err){
    console.log(`[ERROR] @${projectName} is existed`)
  }

  while (true) {
    const taskData = await taskSql.getFirstTask({type: 'GOOGLE_ART'})

    if(!taskData) {
      console.log('[INFO] no more task.')
      process.exit()
    }

    if(!taskData.downloadUrl) {
      console.log('[ERROR] task has no downloadUrl')
      await taskSql.markFailTask(taskData.id)
      continue
    }

    const _meta = JSON.parse(taskData.meta)
    const {downloadUrl, title} = taskData
    console.log(`[INFO] going to translate task ${title}`)
    const meta = await translateInfo(_meta)
  
    const filename = onlyCharDigit(title)
    const filepathMeta = `${__dirname}/../../${taskDir}/${filename}.meta.json`
    const filepathImage = `${__dirname}/../../${taskDir}/${filename}.jpg`

    console.log(`[INFO] going to download ${downloadUrl}`)
    await downloadFileFromUrl(downloadUrl, filepathImage)
    fs.writeFileSync(filepathMeta, JSON.stringify(meta, 0,4))
    await taskSql.finishedTask(taskData.id)
    console.log(`[INFO] Finished processing: ${title}`)
  }
})()