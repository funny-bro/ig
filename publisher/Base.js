const BufferApi = require('../apis/buffer')

class Base {
  constructor({profileName, accessToken}){
    this.accessToken = accessToken
    this.profileName = profileName
    this.bufferInstance = null
    this.targetProfile = null
    this.data = {}
    this.res = {}
  }
  async initProfile(){
    const {accessToken, profileName} = this

    const bufferInstance = new BufferApi(accessToken)
    const profileListRes = await bufferInstance.getProfileList()

    const targetProfile = profileListRes.data.find( item => {
      return item.service_username === profileName
    })

    this.bufferInstance = bufferInstance
    this.targetProfile = targetProfile
    return targetProfile
  }
  async beforeProcess(payload = {}) {
    return payload
  }
  async request(payload) {
    throw '[ERROR] Publisher.request needed to implement'
  }
  async process(payload = {}){
    const {_id} = await this.initProfile()
    const _payload = await this.beforeProcess(payload)    
    console.log('_payload: ', _payload)
    return this.request({
      'profile_ids': _id,
      ..._payload
    })
  }
}

module.exports = Base