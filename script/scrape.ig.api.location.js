(async function(){
  const { argv } = require('optimist')
  const fs = require('fs')
  const {urlFileName} = require('../utils/string')
  const cmd = require('@pscraper/cmd')
  const IGLocationScraper = require('../apiScraper/IGLocation')
  const IGLocationShortcodeScraper = require('../apiScraper/IGLocationShortcode')
  // await cmd('npx @pscraper/scraper --config=./ig.login.js')
  const cookies = require('../ig.login/cookies.json')
  const locationIgId = argv.locationId

  if(!locationIgId) throw '[ERROR] scraper.ig.api.location, locationId is required'

  const igInstance = new IGLocationScraper(cookies, locationIgId)
  const igList = await igInstance.process()

  const listDownloader = (type) => async (itemList, dir) => {
    const download = require('download')
    fs.mkdirSync(`${dir}/${type}`)

    for(const url of itemList) {
      if(!url) continue
      const filename = urlFileName(url)
      await download(url, `${dir}/${type}`)
    }
  }

  for(const igItem of igList){
    const {shortcode} = igItem
    const isShortcodeIns = new IGLocationShortcodeScraper(cookies, shortcode)
    const shortcodeRes = await isShortcodeIns.process()

    const {id, imageList = [], videoList = []} = shortcodeRes
    const dir = `./temp/${id}`

    if(imageList.length<=0 && videoList.length<=0) {
      console.log('[INFO] no available image and video')
      continue
    }
    else {
      console.log(`[INFO] good content: image: ${imageList.length} ; video: ${videoList.length}`)
    }

    fs.mkdirSync(dir)
    fs.writeFileSync(`${dir}/meta.json`, JSON.stringify(shortcodeRes))
    fs.writeFileSync(`${dir}/res.json`, JSON.stringify(isShortcodeIns.res.data))

    await listDownloader('image')(imageList, dir)
    await listDownloader('video')(videoList, dir)
  }

  console.log(' -=-=-=-=- done -=-=-=-=')

  // require('fs').writeFileSync('./test.json', JSON.stringify(res.data))
  // console.log(res.data)

}())



