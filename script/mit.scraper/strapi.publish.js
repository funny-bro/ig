(async function(){
  const fs = require('fs')
  const rootdir = `${__dirname}/../../@mit/images`
  const MediaStrapiClass = require('../../publisherStrapi/Media')

  const username = process.env.STRAPI_USERNAME
  const password = process.env.STRAPI_PASSWORD
  const contentType = 'media'
  const mediaStrapi = new MediaStrapiClass({
    username,
    password,
    contentType,
  })
  
  const dirList = fs.readdirSync(rootdir)
  const jsonList = dirList.filter(item => item.includes('.json'))

  for(const jsonfile of jsonList){
    const jsonStr = fs.readFileSync(`${rootdir}/${jsonfile}`)
    const json = JSON.parse(jsonStr)

    const imageFilename = jsonfile.replace('.meta.json', '')
    const imageFilenpath = `${rootdir}/${imageFilename}.jpg`
    await mediaStrapi.initProfile()
    const uploadedFileList = await mediaStrapi.uploadFileList([{path: imageFilenpath}])
    const imageId = uploadedFileList[0]._id

    console.log('[INFO] image upload success: ', imageId)

    const {
      titlezhw,
      descriptionzhw: description,
      sourceUrl,
    } = json

    const thumbnail = imageId
    const sourceId = ''
    const likeCount = 0
    const source = 'mit'
    const type = 'image'
    const images = [imageId]

    const payload = {title: titlezhw || 'unknown', sourceId, sourceUrl, likeCount, thumbnail, type, source, images, description}

    try {
      const resProcess = await mediaStrapi.process(payload)
      console.log(`[INFO] Media is created: ${resProcess._id}`)
    }
    catch(err){
      console.log('[ERROR] publish strapi', err)
    }
  }

  // try {
  //   const meta = require(`${__dirname}/../${metaDir}/meta.json`)
  //   const imageFileList = fs.readdirSync(`${__dirname}/../${metaDir}/image`)
  
  //   const imageObjList = imageFileList.map(imageFileName => ({
  //     path: `${__dirname}/../${metaDir}/image/${imageFileName}`,
  //     filename: imageFileName
  //   }))
    
  //   await mediaStrapi.initProfile()

  //   const uploadedFileList = await mediaStrapi.uploadFileList(imageObjList)
  //   const {title, id: sourceId, likeCount, sourceUrl} = meta
  //   const description = title 
  //   const thumbnail = uploadedFileList[0]._id
  //   const images = uploadedFileList.map(item => item._id)
  //   const type = 'image'
  //   const source = 'ig'
  //   const payload = {title, sourceId, sourceUrl, likeCount, thumbnail, type, source, images, description}
  //   const resProcess = await mediaStrapi.process(payload)
  
  //   console.log(`[INFO] Media is created: ${resProcess._id}`)
  // }
  // catch(err){
  //   console.log('[ERROR] strapi.publish.ig')
  //   console.log(err)
  // }
})()