(async function(){
  const cmd = require('@pscraper/cmd')
  const fs = require('fs')
  const fileList = fs.readdirSync(`${__dirname}/../temp`)

  for(const dirName of fileList) {
    await cmd(`node script/strapi.publish.ig.js --metaDir=./temp/${dirName}`)
  }
})()