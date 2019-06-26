(async function(){
  const argv = require('optimist').argv;
  const cmd = require('@pscraper/cmd')
  const fs = require('fs')
  const rootUrl = argv.rootUrl
  const projectName = argv.projectName || '@wiki.pscraper'

  if(!rootUrl) throw '[ERROR] wiki pscraper, rootUrl is requred'

  await cmd(`npx @pscraper/scraper --config=./script/pscraper.wiki.images/config.wiki.list.js --rootUrl=${rootUrl}`)
  const _fileList = fs.readFileSync(`${__dirname}/../../@pscraper.wiki-list-temp/imageList.json`)
  const fileList = JSON.parse(_fileList)

  try {
    fs.mkdirSync(`./${projectName}`)
  }
  catch(err){
    console.log(`[ERROR] ${projectName} is existed`)
  }

  for(const item of fileList) {
    const {title, url} = item
    await cmd(`npx @pscraper/scraper --projectName=${projectName} --config=./script/pscraper.wiki.images/config.wiki.download.image.js --url=${url}`)
  }
})()