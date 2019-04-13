const IGApiClass = require('../apis/ig')
const Base = require('./Base')
const _get = require('lodash.get');

const getTitle = function(item) {
  const titleParent = _get(item, 'edge_media_to_caption.edges', [])
  return titleParent && titleParent[0] && titleParent[0].node && titleParent[0].node.text || ''
}

class IGShortcode extends Base{
  constructor(cookies, shortcode){
    super()
    this.cookies = cookies
    this.shortcode = shortcode
  }
  fetchData(){
    const IGApi = new IGApiClass(this.cookies)
    return IGApi.getShortCode(this.shortcode)
  }
  parseData(res){
    const {graphql} = res.data
    const _imageList = _get(res.data, 'graphql.shortcode_media.edge_sidecar_to_children.edges', [])
    const id = _get(res.data, 'graphql.shortcode_media.id', '')
    const title = getTitle(graphql.shortcode_media)
    const type = _get(res.data, 'graphql.shortcode_media.is_video', false) ? 'video' : 'image'
    const viewCount = _get(res.data, 'graphql.shortcode_media.video_view_count', 0)

    const imageList = []
    const videoList = []
    for(const nodeItem of _imageList){
      const type = (nodeItem.node.__typename === 'GraphVideo')? 'video' : 'image'
      
      if(type === 'video') videoList.push(nodeItem.node.video_url)

      else imageList.push(nodeItem.node.display_resources[2].src)
    }

    return {id, title, imageList, videoList, type, viewCount}
  }

}

module.exports = IGShortcode