(async function(){
  const IgPublisher = require('./publisher/IgPublisher')
  const profileName = 'ageofstory'
  const accessToken = process.env.BUFFER_ACCESS_TOKEN
  const ts = new Date().getTime()
  
  const payload = {
    text: `text-${ts}`,
    media: { photo: 'https://www.artmuseum.org/wp-content/uploads/Michael-Sample-Banner.jpg'}
  }

  try {
    const IgPublisherInstance = new IgPublisher({profileName, accessToken})
    const res = await IgPublisherInstance.process(payload)
    console.log(res)
  }
  catch(err){
    console.log(err)
    console.log(' -=-=-= buffer.js')
  }
})()