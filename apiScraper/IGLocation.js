const IGApiClass = require('../apis/ig')
const urlUtils = require('../apis/url')
const Base = require('./Base')
const _get = require('lodash.get');

const getTitle = function(item) {
  const titleParent = _get(item, 'node.edge_media_to_caption.edges', [])
  return titleParent && titleParent[0] && titleParent[0].node && titleParent[0].node.text || ''
}

class Location extends Base{
  constructor(cookies, LocationId){
    super()
    this.LocationId = LocationId
    this.cookies = cookies
  }
  fetchData(){
    const {cookies, LocationId} = this
    this.sourceUrl = urlUtils.ig.location(LocationId)
    const IGApi = new IGApiClass(cookies)
    return IGApi.getLocation(LocationId)
  }
  parseData(res){
    console.log('res')
    const list = res.data.graphql.location.edge_location_to_media.edges

    return list.map(item => {
      const id = item.node.id
      const title = getTitle(item)
      const image = item.node.thumbnail_src
      const shortcode = item.node.shortcode
      return {title, image, id, shortcode}
    })
  }

}

module.exports = Location