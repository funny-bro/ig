(async function(){
  const fs = require('fs')
  const { argv } = require('optimist')
  const MediaStrapiClass = require('../publisherStrapi/Media')

  const username = process.env.STRAPI_USERNAME
  const password = process.env.STRAPI_PASSWORD
  const contentType = 'media'
  const mediaStrapi = new MediaStrapiClass({
    username,
    password,
    contentType,
    translateFieldList: ['title', 'description']
  })
  const metaDir = argv.metaDir

  if(!metaDir) throw '[ERROR] metaDir is required'
  console.log('[INFO] going to process metaDir : ', metaDir)

  try {
    const meta = require(`${__dirname}/../${metaDir}/meta.json`)
    const imageFileList = fs.readdirSync(`${__dirname}/../${metaDir}/image`)
  
    const imageObjList = imageFileList.map(imageFileName => ({
      path: `${__dirname}/../${metaDir}/image/${imageFileName}`,
      filename: imageFileName
    }))
    
    await mediaStrapi.initProfile()

    const uploadedFileList = await mediaStrapi.uploadFileList(imageObjList)
    const {title, id: sourceId, likeCount, sourceUrl} = meta
    const description = title 
    const thumbnail = uploadedFileList[0]._id
    const images = uploadedFileList.map(item => item._id)
    const type = 'image'
    const source = 'ig'
    const payload = {title, sourceId, sourceUrl, likeCount, thumbnail, type, source, images, description}
    const resProcess = await mediaStrapi.process(payload)
  
    console.log(`[INFO] Media is created: ${resProcess._id}`)
  }
  catch(err){
    console.log('[ERROR] strapi.publish.ig')
    console.log(err)
  }
})()