const Base = require('./Base')

class IgPublisher extends Base{
  async request(payload) {
    return this.bufferInstance.createPost(payload)
  }
}

module.exports = IgPublisher