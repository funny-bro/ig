(async function(){
  const translateApi = require('../apis/translate')
  const IgPublisher = require('../publisher/IgPublisher')
  const accessToken = process.env.BUFFER_ACCESS_TOKEN
  const profileName = 'ageofstory'
  const ts = new Date().getTime()
  
  const { argv } = require('optimist')
  const metaDir = argv.metaDir

  console.log('metaDir : ', metaDir)

  if(!metaDir) throw '[ERROR] metaDir is required'

  const meta = require(`${__dirname}/../${metaDir}/meta.json`)
  const imageUrl = meta.imageList[0]

  if(!imageUrl) throw '[ERROR] imageUrl is required'

  const zhCnTitle = await translateApi(meta.title)
  const payload = {
    text: `${zhCnTitle} ${meta.title}`,
    media: { photo: imageUrl}
  }

  try {
    const IgPublisherInstance = new IgPublisher({profileName, accessToken})
    const res = await IgPublisherInstance.process(payload)
    console.log(res)
  }
  catch(err){
    console.log(err)
    console.log(' -=-=-= buffer.js')
  }
})()