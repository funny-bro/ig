(async function(){
  
  const BufferApi = require('./apis/buffer')
  const accessToken = process.env.BUFFER_ACCESS_TOKEN

  const bufferIns = new BufferApi(accessToken)
  const profileListRes = await bufferIns.getProfileList()

  const funnypage = profileListRes.data.find( item => {
    return item.service_username === '熱浪'
  })

  const funnypageItem = await bufferIns.getProfileById(funnypage.id)

  const ts = new Date().getTime()
  
  const payload = {
    'profile_ids': funnypage.id,
    text: `test-${ts}`,
    attachment: false,
    media: {
      // photo: 'http://techslides.com/demos/sample-videos/small.mp4',
      // image: 'http://techslides.com/demos/sample-videos/small.mp4',
      video: {
        title: 'test',
        details: {
          location: 'http://techslides.com/demos/sample-videos/small.mp4',
        }
      }

      // expanded_link: 'http://techslides.com/demos/sample-videos/small.mp4',
    }
  }

  try {
    const res = await bufferIns.createPost(payload)
    console.log(res)
  }
  catch(err){
    console.log(' -=-=-= buffer.js')
  }
})()