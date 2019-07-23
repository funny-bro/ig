(async function(){
  const { connect } = require('./db')
  const {skipOrCreate} = require('./utils/taskSql')
  const cmd = require('@pscraper/cmd')
  const ytdl = require('ytdl-core')
  const {onlyCharDigit} = require('../../utils/string')
  const fs = require('fs')

  const { argv } = require('optimist')
  const projectName = argv.projectName || `youtube2019`
  const taskDir = `@${projectName}`
  const entry = argv.rootUrl

  const getPageId = (url) => {
    return onlyCharDigit(url.split('/').slice(-2).join(''))
  }

  const infoYoutube = (url) => new Promise((resolve, reject)=> {
    ytdl.getInfo(url, (err, info) => {
      if (err) throw err;
      return resolve(info)
    });
  })
  
  try {
    await connect()
    fs.mkdirSync(`./${taskDir}`)
    fs.mkdirSync(`./${taskDir}/trash`)
  }
  catch(err){
    console.log(`[ERROR] @${projectName} is existed`)
  }

  // scrape from list 
  console.log(`[INFO] starting entry: ${entry}`)
  if(!entry) {
    console.error(`[ERROR] entry is required but ${entry}`)
    process.exit(1)
  }

  const id = getPageId(entry)

  try {
    await cmd(`npx @pscraper/scraper --config=./script/youtube.scraper/pscraper.config.js --entry=${entry} --taskDir=./${taskDir} --id=${id}`)

    const youtubeItemList = JSON.parse(fs.readFileSync(`./${taskDir}/task-${id}.json`, 'utf8'))
    for(const item of youtubeItemList) {
      const {url} = item
      const sourceUrl = `http://www.youtube.com${url}`
      const info = await infoYoutube(sourceUrl)

      const type = 'YOUTUBE'
      const {title ,description, ucid: sourceId} = info
      const payload = {
        title,
        description, 
        sourceUrl,
        downloadUrl: sourceUrl,
        type,
        sourceId,
      }
      await skipOrCreate(sourceId, payload)
    }

    console.log('[INFO] all video is added to task')
    process.exit()
  }
  catch(err){
    // i -=1
    console.error('[ERROR] for loop',err)
  }
})()