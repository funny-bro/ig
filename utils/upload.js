const MediaStrapiClass = require('../publisherStrapi/Media')

const uploadStrapi = async (path) => {
  const username = process.env.STRAPI_USERNAME
  const password = process.env.STRAPI_PASSWORD
  const contentType = 'media'
  const mediaStrapi = new MediaStrapiClass({
    username,
    password,
    contentType,
  })
  await mediaStrapi.initProfile()
  
  const uploadedFileList = await mediaStrapi.uploadFileList([{path}])
  return uploadedFileList[0]
}

module.exports = {
  uploadStrapi
}