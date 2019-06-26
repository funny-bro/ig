const cheerio = require('cheerio')
const {urlDomain, onlyCharDigit} = require('../../utils/string')
const argv = require('optimist').argv;

const name = `@pscraper.mit-list-temp`
// const url = argv.rootUrl
const url = argv.entry
const taskDir = argv.taskDir
const id = argv.id

const domain = urlDomain(url)
let galleryUrl = ''
module.exports = {
  name,
  url,
  // isDownloadResource: true,
  // downloadResourceType: ['image'],
  afterPageLoad: async function(page){
    const frames = await page.frames();
    let galleryFrame = frames.find(f => {
      return f.url().includes('gallery_')
    });  

    if(!galleryFrame) {
      galleryFrame = frames[1]
    }

    console.log('[INFO] going to gallery iframe page : ', galleryFrame.url())
    galleryUrl = galleryFrame.url()
    await page.goto(galleryFrame.url());
  },
  afterHtmlLoad: async function(html){
    const $ = cheerio.load(html);
    const bigImagePageList = []
    $('td').map(function(i, el) {
      const title = $(this).find('a').text()
      const _url = $(this).find('a').attr('href')
      bigImagePageList.push({
        title: onlyCharDigit(title),
        url: `${galleryUrl}/../${_url}`
      })
    })

    require('fs').writeFileSync(`${taskDir}/task-${id}.json`, JSON.stringify(bigImagePageList))
  },
}