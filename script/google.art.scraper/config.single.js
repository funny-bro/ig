const cheerio = require('cheerio')
const argv = require('optimist').argv;
const {fetchImageAutoZoom} = require('./utils/fetchImage')
const {skipOrCreate} = require('../../utils/taskSql')
const {onlyCharDigit} = require('../../utils/string')

const projectName = argv.projectName || `@pscraper.google.art`

const name = projectName
const url = argv.rootUrl

module.exports = {
  name,
  url,
  isDownloadResource: false,
  isDeletTempDir: true,
  // downloadResourceType: ['image'],
  afterPageLoad: async function(page){
    await page.evaluate((n) => {
      window.scrollBy(0, 1000);
    })
  },
  afterHtmlLoad: async function(html){
    const payload = {}
    const $ = cheerio.load(html);
    const des1 = $('.WDSAyb.QwmCXd').text()

    payload.descriptionPage = des1
    
    $('.ve9nKb li').map(function(i, el) {
      const _key = $(this).find('span').text()
      const _value = $(this).text()
      const value = _value.replace(_key, '')
      const key = onlyCharDigit(_key).toLocaleLowerCase()
      payload[key] = value
    })

    payload.description = payload.description || payload.descriptionPage || ''
  
    const sourceId = onlyCharDigit(url)
    const sourceUrl = url
    const type = 'GOOGLE_ART'

    let downloadUrl = ''
    try {
      console.log(`[INFO] going to process downloadUrl ${payload.title} : ${sourceUrl}`)
      downloadUrl = (await fetchImageAutoZoom(sourceUrl)).data.url  
    }
    catch(err){
      console.log(`[ERROR] fetchImage fail, sourceUrl: ${sourceUrl}`, err)
      downloadUrl = ''
    }
    await skipOrCreate(sourceId, {
      title: payload.title,
      description: payload.description,
      sourceId,
      type,
      sourceUrl,
      downloadUrl,
      meta: JSON.stringify({...payload})
    })
  },
}