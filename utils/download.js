
const https = require('https');
const fs = require('fs');
const {urlFileName} = require('./string')

const toFile = (url = '', toPath ='') => {
  return new Promise((resolve)=>{
    const fileName = toPath || urlFileName(url)
    const file = fs.createWriteStream(fileName);
    https.get(url, function(response) {
      response.pipe(file);
      return resolve()
    });  
  })
}

module.exports = {
  toFile
}