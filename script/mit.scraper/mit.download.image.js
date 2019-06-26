const cheerio = require('cheerio')
const downloader = require('../../utils/download')
const {onlyCharDigit, limitLength} = require('../../utils/string')
const translateApi = require('../../apis/translate')
const argv = require('optimist').argv;
const TARGET_URL = argv.url
const TARGET_NAME = argv.name

const _name = TARGET_NAME || `@pscraper.mit.download.image`
const name = `${_name}-${new Date().getTime()}`
const url = TARGET_URL
const taskDir = argv.taskDir

module.exports = {
  name,
  url,
  isDeletTempDir: true,
  // isDownloadResource: true,
  // downloadResourceType: ['image'],
  // afterPageLoad: scrollDown,
  afterHtmlLoad: async function(html){
    const $ = cheerio.load(html);

    let title =  $('div[align=center]:nth-child(5)').text()
    const description =  $('div[align=center]:nth-child(7)').text()
    const sourceUrl = TARGET_URL
    const location = $('div[align=center]:nth-child(8)').text()

    let imageUrl = $('div[align=center]:nth-child(3)').find('img').attr('src')
    if(!imageUrl){
      imageUrl = $('center:nth-child(3)').find('img').attr('src')
    }
    if(!title) {
      title = $('font').text()
    }

    const _url = `${url}/../${imageUrl}`
    const filename = onlyCharDigit(title) || `${new Date().getTime()}`
    const _filename = filename.slice(0,20) + `${new Date().getTime()}`
      
    const titlezhw = await translateApi(title)
    const descriptionzhw = await translateApi(description)
    const locationzhw = await translateApi(location)

    console.log(`[INFO] going to save image to : ${taskDir}/${_filename}.jpg`)
    await downloader.toFile(_url,`${taskDir}/${_filename}.jpg`)

    require('fs').writeFileSync(`./${taskDir}/${_filename}.meta.json`, JSON.stringify({
      title,
      titlezhw,
      description,
      descriptionzhw,
      sourceUrl,
      imageUrl: _url,
      location,
      locationzhw
    }))
  },
}