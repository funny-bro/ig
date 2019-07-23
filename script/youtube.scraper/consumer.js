(async function(){
  const ytdl = require('ytdl-core')
  const fs = require('fs')

  const { connect } = require('./db')
  const { getFirstTask, finishedTask } = require('./utils/taskSql')

  const translateApi = require('../../apis/translate')
  const {onlyCharDigit} = require('../../utils/string')

  const { argv } = require('optimist')
  const projectName = argv.projectName || `youtube2019`
  const taskDir = `@${projectName}`

  const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

  const downloadYoutube = (url, filepath) => new Promise((resolve, reject)=> {
    try {
      if(!url || !filepath) return reject('[ERROR] both params url, filepath are required: ', url, filepath)
      const options = {
        filter: (format) => format.container === 'mp4',
        quality: 'highest'
      }
      const stream = ytdl(url, options)
      .pipe(fs.createWriteStream(filepath))
  
      stream.on('finish', function () {
        return resolve()
      });
    }
    catch(err){
      console.log('[ERROR] downloadYoutube exception: ', err)
      return reject(err)
    }
  })

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
    const {title, keywords, shortDescription } = info
    const zhTitle = await _translateApi(title)
    await sleep(1)
    const zhShortDescription = await _translateApi(shortDescription)
    await sleep(1)
    const zhKeywords = []

    if(keywords && keywords.length && keywords.length >=1 ){
      for(const kw of keywords) {
        const t = await _translateApi(kw)
        await sleep(1)
        zhKeywords.push(t)
      }
    }

    return {
      zhTitle,
      zhShortDescription,
      zhKeywords,
      ...info,
    }
  }

  const infoYoutube = (url) => new Promise((resolve, reject)=> {
    ytdl.getInfo(url, (err, info) => {
      if (err) throw err;
      return resolve(info)
    });
  })

  try{
    await connect()
    console.log('[INFO] DB connected')
  
    while (true) {
      const taskData = await getFirstTask()

      if(!taskData) {
        console.log('[INFO] no more task.')
        process.exit()
      }

      const {title, sourceUrl} = taskData
      console.log(`[INFO] -=-=-=-= fetched task ${title} -=-=-=-=`)
  
      const filename = onlyCharDigit(title)
      const filepathMeta = `${__dirname}/../../${taskDir}/${filename}.meta.json`
      const filepathVideo = `${__dirname}/../../${taskDir}/${filename}.mp4`
      const info = await infoYoutube(sourceUrl)
      console.log('[INFO] fetched youtube info')
    
      const _info = info.player_response.videoDetails
      const __info = await translateInfo(_info)
      console.log('[INFO] translated info')
    
      fs.writeFileSync(filepathMeta, JSON.stringify(__info, 0,4))
      console.log('[INFO] writing meta')
      console.log('[INFO] going to download: ', sourceUrl)
    
      try {
        await downloadYoutube(sourceUrl, filepathVideo)
        await finishedTask(taskData.id)
        console.log(`[INFO] Finished processing: ${title}`)
      }
      catch(err){
        await markFailTask(taskData.id)
      }
    }
  }
  catch(err){
    // i -=1
    console.error('[ERROR] exeption',err)
  }
})()