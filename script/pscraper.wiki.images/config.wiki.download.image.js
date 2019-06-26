const cheerio = require('cheerio')
const downloader = require('../../utils/download')
const translateApi = require('../../apis/translate')

const argv = require('optimist').argv;
const TARGET_URL = argv.url
const TARGET_NAME = argv.name
const projectName = argv.projectName

const _name = TARGET_NAME || `@pscraper.wiki.download.image`
const name = `${_name}-${new Date().getTime()}`
const url = TARGET_URL

const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

const _translateApi = async (str) => {
  try {
    const result = await translateApi(str)
    return result
  }
  catch(err){
    return ''
  }
}

module.exports = {
  name,
  url,
  isDeletTempDir: true,
  // isDownloadResource: true,
  // downloadResourceType: ['image'],
  // afterPageLoad: scrollDown,
  afterHtmlLoad: async function(html){
    const $ = cheerio.load(html);
    const imageUrl = $('.fullImageLink').find('a').attr('href')
    const comment = $('.filehistory td:nth-child(6)').text()
    const title = $('h1').text()

    const zhTitle = await _translateApi(title)
    await sleep(2)
    const zhComment = await _translateApi(comment)

    const meta = {
      title,
      comment,
      imageUrl,
      zhTitle,
      zhComment
    }
    await downloader.toFile(imageUrl,`./${projectName}/${name}.jpg`)
    require('fs').writeFileSync(`./${projectName}/${name}.meta.json`, JSON.stringify(meta, null, 2))
  },
}