(async function(){
  const translateApi = require('../../apis/translate')

  const {urlDomain, onlyCharDigit} = require('../../utils/string')

  const projectName = 'youtubeApe'
  const taskDir = `@${projectName}`

  const fs = require('fs')
  const ytdl = require('ytdl-core')

  const imageList = fs.readdirSync(`${__dirname}/../../${taskDir}`)

  const taskJsonFilename = imageList.find( filename => filename.includes('task-'))
  const taskJson = require(`../../${taskDir}/${taskJsonFilename}`)
  const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

  const downloadYoutube = (url, filepath) => new Promise((resolve, reject)=> {
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
  })

  const infoYoutube = (url) => new Promise((resolve, reject)=> {
    ytdl.getInfo(url, (err, info) => {
      if (err) throw err;
      return resolve(info)
    });
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

  const infoIdList = []
  for(const {title, url} of taskJson) {
    const filename = onlyCharDigit(title)
    const filepathMeta = `${__dirname}/../../${taskDir}/${filename}.meta.json`
    const filepathVideo = `${__dirname}/../../${taskDir}/${filename}.mp4`
    const info = await infoYoutube(`http://www.youtube.com${url}`)
    const _info = info.player_response.videoDetails

    if(infoIdList.find(id => id === _info.videoId)) continue

    const __info = await translateInfo(_info)

    infoIdList.push(__info.videoId)
    fs.writeFileSync(filepathMeta, JSON.stringify(__info, 0,4))
    await downloadYoutube(`http://www.youtube.com${url}`, filepathVideo)
    console.log(`[INFO] Finished processing: ${title}`)
  }
})()