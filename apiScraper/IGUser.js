const IGApiClass = require('../apis/ig')
const Base = require('./Base')

class IGUser extends Base{
  constructor(cookies, igUserId){
    super()
    this.igUserId = igUserId
    this.cookies = cookies
  }
  fetchData(){
    const {cookies, igUserId} = this
    const IGApi = new IGApiClass(cookies)
    return IGApi.getUser(igUserId)
  }
  parseData(res){
    console.log('res')
    const list = res.data.graphql.user.edge_owner_to_timeline_media.edges

    return list.map(item => {
      const title = item.node.edge_media_to_caption.edges[0].node.text
      const image = item.node.thumbnail_src
      const id = item.node.id
      const shortcode = item.node.shortcode
      return {title, image, id, shortcode}
    })
  }

}

module.exports = IGUser