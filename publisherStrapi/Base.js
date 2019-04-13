const Strapi = require('strapi-sdk-javascript').default
const baseUrl = process.env.STRAPI_URL
// const baseUrl = 'http://localhost:1337'
const translateApi = require('../apis/translate')

class Base {
  constructor({username, password, contentType, translateFieldList = []}){
    if(!username || !password) throw `[ERROR] publisherStrapi constructor, username, password are required`

    this.strapi = new Strapi(baseUrl);
    this.username = username
    this.password = password
    this.contentType = contentType
    this.translateFieldList = translateFieldList
  }
  async initProfile(){
    const {strapi, username, password} = this
    return await strapi.login(username, password);
  }
  async beforeProcess(payload = {}) {
    return payload
  }
  async request(payload) {
    const {contentType, strapi} = this
    return strapi.createEntry(contentType, payload)
  }
  async translate(payloadFieldList = []){
    const {payload} = this
    for(let i =0 ; i< payloadFieldList.length; i++){
      const field = payloadFieldList[i]
      const originText = payload[field]
      const t = await translateApi(originText)
      this.payload[field] = t
    }
  }
  async process(payload = {}){
    const _payload = await this.beforeProcess(payload)    
    this.payload = _payload
    await this.translate(this.translateFieldList)
    // console.log('_payload: ', _payload)
    return this.request({...this.payload})
  }
}

module.exports = Base