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
    console.log(`[INFO] profile is going to init: `, profileName, accessToken)

    const bufferInstance = new BufferApi(accessToken)
    const profileListRes = await bufferInstance.getProfileList()
    const targetProfile = profileListRes.find( item => {
      return item.service_username === profileName
    })

    this.bufferInstance = bufferInstance
    this.targetProfile = targetProfile
    console.log(`[INFO] profile is inited success: ${targetProfile}`)
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
    return this.request({
      'profile_ids': _id,
      ..._payload
    })
  }
}

module.exports = Base