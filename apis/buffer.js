const request = require('request')
require('./apiLogger')

const baseUrl = 'https://api.bufferapp.com'

class BufferApi {
  constructor(accessToken){
    if(!accessToken) throw '[ERROR] BufferApi constructor, accesstoken is required'
    this.accessToken = accessToken
  }

  getProfileList() {
    return new Promise((resolve, reject) => {
      const {accessToken} = this
      const url = `${baseUrl}/1/profiles.json?access_token=${accessToken}`

      request(url, function (error, response, body) {
        if(error) return reject(error)
        return resolve(JSON.parse(body))
      });
    })
  }

  getProfileById(id) {
    return new Promise((resolve, reject) => {
      if(!id) throw '[ERROR] BufferApi getProfileById, id is required'

      const {accessToken} = this
      const url = `${baseUrl}/1/profiles/${id}.json?access_token=${accessToken}`

      request(url, function (error, response, body) {
        if(error) return reject(error)
        return resolve(JSON.parse(body))
      });
    })
  }

  createPost(payload) {
    const {accessToken} = this

    return new Promise((resolve, reject)=>{
      const {text, profile_ids, media} = payload
      const options = {
        method: 'POST',
        url: `${baseUrl}/1/updates/create.json`,
        qs: { access_token: accessToken },
        headers: 
         { 'Content-Type': 'application/x-www-form-urlencoded' },
        form: { text, profile_ids, media} 
      };
      
      request(options, function (error, response, body) {
        if (error) return reject(error)
      
        return resolve(body);
      });
    })
  }
}


module.exports = BufferApi