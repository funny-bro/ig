const FormData = require('form-data');
const Base = require('./Base')
const fs = require('fs')

class MediaPublish extends Base{
  constructor(config){
    super(config)
    this.uploadedFileList = null
  }
  async uploadFileList(localFilePathList = []) {
    const form = new FormData();
    for(const imageItem of localFilePathList){
      const {path, filename} = imageItem
      form.append('files', fs.createReadStream(path), filename);
    }
    return this.uploadedFileList = await this.strapi.upload(form, {
      headers: form.getHeaders()
    });
  }

  async beforeProcess(payload = {}) {
    const fileIdList = this.uploadedFileList.map(item => item._id)
    return {
      ...payload,
      images: [...fileIdList]
    }
  }
}

module.exports = MediaPublish