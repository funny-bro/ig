const axios = require('axios')
const baseUrl = process.env.GOOGLE_ART_DOWNLOAD_API

const fetchImage = async (targetUrl = '', zoom = 4) => {
  if(!targetUrl) throw `[ERROR] fetchImage(): targetUrl is required: ${targetUrl}`

  const url = `${baseUrl}?url=${targetUrl}&zoom=${zoom}`
  const instance = axios.create({
    timeout: 1000 * 20, // Wait for 20 seconds
  })

  return instance.get(url)
}

const fetchImageAutoZoom = async (targetUrl, zoom = 4) => {
  try {
    const result = await fetchImage(targetUrl, zoom)
    return result
  }
  catch(err) {
    console.log(`[ERROR] fetchImageAutoZoom fail in zoom = ${zoom}`)
    if(zoom >= 2) {
      return fetchImageAutoZoom(targetUrl, zoom - 1)
    }
    throw new Error(err)
  }
}

module.exports = {
  fetchImage,
  fetchImageAutoZoom
}