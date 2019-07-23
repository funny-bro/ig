(async function(){
  const argv = require('optimist').argv;
  const cmd = require('@pscraper/cmd')
  const fs = require('fs')
  const rootUrl = argv.rootUrl
  const listFile = argv.listFile

  let listData = []
  const db = require('../../utils/taskSql/db')

  if(!rootUrl && !listFile) throw '[ERROR] google art pscraper, rootUrl or listFile is required'

  if(rootUrl && !rootUrl.includes('artsandculture.google.com/asset')) throw `[ERROR] given rootUrl is not google art : ${rootUrl}`

  await db.connect()

  // process single google art
  if(rootUrl) {
    listData = [rootUrl]
  }
  // process list google art url
  else {
    try {
      listData = [...require(`${process.cwd() }/${listFile}` )]
    }
    catch(e) {
      throw e
    }
  }
  
  for(const url of listData) {
    await cmd(`npx @pscraper/scraper --config=./script/google.art.scraper/config.single.js --rootUrl=${url}`)
  }
})()