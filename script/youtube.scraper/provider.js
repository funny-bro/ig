(async function(){
  const { connect } = require('./db')
  const {skipOrCreate} = require('./utils/taskSql')
  const cmd = require('@pscraper/cmd')
  const ytdl = require('ytdl-core')
  const {onlyCharDigit} = require('../../utils/string')

  const fs = require('fs')
  const projectName = 'youtubeApe20190626'
  const taskDir = `@${projectName}`
  const entryList = [ 'https://www.youtube.com/results?search_query=gorilla+monkey+ape+smart&sp=EgIYAQ%253D%253D' ]

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
  for(let i = 0; i< entryList.length; i++) {
    const entry = entryList[i]
    console.log(`[INFO] starting entry: ${entry}`)
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
    }
    catch(err){
      // i -=1
      console.error('[ERROR] for loop',err)
      continue
    }
  }
})()