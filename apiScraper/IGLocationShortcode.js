const IGApiClass = require('../apis/ig')
const urlUtils = require('../apis/url')
const Base = require('./Base')
const _get = require('lodash.get');
const {retrieveObject} = require('../utils/string')

const getTitle = function(item) {
  const titleParent = _get(item, 'edge_media_to_caption.edges', [])
  return titleParent && titleParent[0] && titleParent[0].node && titleParent[0].node.text || ''
}

const processNodeItem = (itemList) => {
  const imageUrl = []
  const videoList = []
  for(const nodeItem of itemList){
    const type = (nodeItem.node && nodeItem.node.__typename === 'GraphVideo')? 'video' : 'image'
    
    if(type === 'video') {
      const videoUrl = nodeItem.video_url
      if(videoList) videoList.push(videoUrl)
    }
    else {
      const imageUrl = retrieveObject(nodeItem, 'display_resources[2].src')
      if(imageUrl) imageList.push(imageUrl)
    }
  }

  return [imageUrl, videoList]
}

class IGShortcode extends Base{
  constructor(cookies, shortcode){
    super()
    this.cookies = cookies
    this.shortcode = shortcode
  }
  fetchData(){
    const IGApi = new IGApiClass(this.cookies)
    this.sourceUrl = urlUtils.ig.shortCode(this.shortcode)
    return IGApi.getShortCode(this.shortcode)
  }
  parseData(res){
    const {sourceUrl} = this
    const {graphql} = res.data
    const isSlider = graphql.shortcode_media.edge_sidecar_to_children

    const _imageList = !isSlider
      ?retrieveObject(graphql, 'shortcode_media.display_resources[2].src') || []
      :_get(res.data, 'graphql.shortcode_media.edge_sidecar_to_children.edges', [])      

    const id = _get(res.data, 'graphql.shortcode_media.id', '')
    const title = getTitle(graphql.shortcode_media)
    const type = _get(res.data, 'graphql.shortcode_media.is_video', false) ? 'video' : 'image'
    const viewCount = _get(res.data, 'graphql.shortcode_media.video_view_count', 0)
    const likeCount =  _get(res.data, 'graphql.shortcode_media.edge_media_preview_like.count', 0)

    require('fs').writeFileSync('./shortcode.json', JSON.stringify(res.data))

    let imageList = []
    let videoList = []

    if(typeof _imageList === 'string') {
      imageList = [_imageList]
    }
    else {
      [imageList, videoList] = processNodeItem(_imageList)
    }

    return {id, title, imageList, videoList, type, viewCount, likeCount, sourceUrl}
  }
}

module.exports = IGShortcode