const fs = require('fs')
const argv = require('optimist').argv;
const cookies = require('./@pscraper.buffer.login/cookies.json').cookies

const metaDir = argv.metaDir
const projectName = `@pscraper.buffer.upload`

const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

if(!metaDir) throw `[ERROR] metaDir is required, but ${metaDir}`

module.exports = {
  name: projectName,
  url: 'https://buffer.com/app/profile/5c80d3c16f97e37ca231db79/buffer/queue/list',
  isDownloadCookies: true,
  isDownloadResource: true,
  // downloadResourceType: [],
  beforeGotoPage: async function(page){
    await page.setCookie(...cookies);
  },
  afterPageLoad: async function(page){
    try {
      await page.click('input.dummy-composer-input')
      
      const frames = await page.frames();
      const tryItFrame = frames.find(f => {
        return f.url().includes('add?app=WEB')
      });    

      await sleep(2)

      await tryItFrame.click(`.ProfileSection__profilesScrollContainer___1-hCh div:nth-child(1)`);
      await tryItFrame.click(`.ProfileSection__profilesScrollContainer___1-hCh div:nth-child(5)`);
      await tryItFrame.click(`.ProfileSection__profilesScrollContainer___1-hCh div:nth-child(6)`);
      await tryItFrame.click('.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr')

      const fileUploader = await tryItFrame.$('input[type=file]');

      const meta = require(`${metaDir}/meta.json`)
      const imageList = fs.readdirSync(`${metaDir}/image`)

      await page.screenshot({path: `${projectName}/2.1-=-=-=-=-=-=-.png`})
      for(const imagePath of imageList) {
        await fileUploader.uploadFile(`${metaDir}/${imagePath}`);
        await sleep(15)
      }
      await page.screenshot({path: `${projectName}/2.2-=-=-=-=-=-=-.png`})

      tryItFrame.type('div[contenteditable=true]', meta.title || '--')

      await sleep(20)
      await page.screenshot({path: `${projectName}/2.9-=-=-=-=-=-=-.png`})
      tryItFrame.click('button.BaseButton__specificityAnchor___2rD__')
      await sleep(2)
      
      await page.screenshot({path: `${projectName}/2.2-=-=-=-=-=-=-.png`})
    }
    catch(err){
      console.log(err)
      await page.screenshot({path: `${projectName}/err.png`})
    }
  }
}