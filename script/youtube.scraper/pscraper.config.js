const cheerio = require('cheerio')
const {urlDomain, onlyCharDigit} = require('../../utils/string')
const argv = require('optimist').argv;

const name = `@pscraper.youtube-64-list-temp`
// const url = argv.rootUrl
const url = argv.entry
const taskDir = argv.taskDir
const id = argv.id
const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

module.exports = {
  name,
  url,
  // isDownloadResource: true,
  // downloadResourceType: ['image'],
  afterPageLoad: async function(page){
    const scrollingdown = (n = 1) => page.evaluate((n) => {
      window.scrollBy(0, n*window.innerHeight);
    }, n);

    await scrollingdown(1)
    await sleep(2)
    await scrollingdown(2)
    await sleep(2)
    await scrollingdown(3)
    // await sleep(2)
    // await scrollingdown(4)
    // await sleep(2)
    // await scrollingdown(5)
    // await sleep(2)
    // await scrollingdown(6)
    // await sleep(2)
    // await scrollingdown(7)
    // await sleep(2)

  },
  afterHtmlLoad: async function(html){
    const $ = cheerio.load(html);
    const bigImagePageList = []
    $('a').map(function(i, el) {
      const title = $(this).attr('title') || $(this).text()
      const _url = $(this).attr('href')

      if(_url && _url.includes('/watch')) {
        bigImagePageList.push({
          title: title.trimLeft().trimRight(),
          url: _url
        })
      }
    })

    require('fs').writeFileSync(`${taskDir}/task-${id}.json`, JSON.stringify(bigImagePageList))
  },
}