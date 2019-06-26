const cheerio = require('cheerio')
const {urlDomain, onlyCharDigit} = require('../../utils/string')
const argv = require('optimist').argv;

const projectName = argv.projectName || `@pscraper.wiki-list-temp`
const url = argv.rootUrl
// const url = 'https://commons.wikimedia.org/wiki/Category:Dutch_East_India_Company'
const domain = urlDomain(url)
module.exports = {
  name: projectName,
  url,
  // isDownloadResource: true,
  // downloadResourceType: ['image'],
  afterHtmlLoad: async function(html){
    const $ = cheerio.load(html);
    const bigImagePageList = []

    $('.gallerybox').map(function(i, el) {
      const title = $(this).find('a').text()
      const url = $(this).find('a').attr('href')
      bigImagePageList.push({
        title: onlyCharDigit(title),
        url: `https://${domain}${url}`
      })
    })

    require('fs').writeFileSync(`./${projectName}/imageList.json`, JSON.stringify(bigImagePageList))
  },
}