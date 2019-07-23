(async function(){

  const cmd = require('@pscraper/cmd')
  const fs = require('fs')
  const { argv } = require('optimist')
  const logo = './images/logo400X100.png'
  const {dir} = argv
  const IgPublisher = require('../../publisher/IgPublisher')

  const waterMarkPath = `${__dirname}/../../${dir}/imagesWater`
  const watermark = require('../../utils/watermark')
  const upload = require('../../utils/upload')
  const profileName = 'ageofstory'
  const accessToken = process.env.BUFFER_ACCESS_TOKEN

  const processWatermark = (input, outputFilePath) => {
    return watermark(input, logo, {output: outputFilePath})
  }
  try {
    fs.mkdirSync(waterMarkPath)
  }
  catch(err){
    console.log(`[ERROR] ${waterMarkPath} is existed`)
  }

  const title = fs.readFileSync(`${__dirname}/../../${dir}/title.txt`)
  const imageList = fs.readdirSync(`${__dirname}/../../${dir}/images`)
  console.log(`[INFO] going to process ${imageList.length} watermark`)
  for(const filename of imageList) {
    if(filename.includes('.DS_Store')) continue
    const inputPath = `${__dirname}/../../${dir}/images/${filename}`
    const outputPath = `${waterMarkPath}/${filename}`
    console.log(`[INFO] going to process ${inputPath}`)
    await processWatermark(inputPath, outputPath)
  }
  console.log(`[INFO] done ${imageList.length}watermark`)

  const waterImgesList = fs.readdirSync(waterMarkPath)
  for(const filename of waterImgesList) {
    try {
      const {url} = await upload.uploadStrapi(`${waterMarkPath}/${filename}`)
      console.log(`[INFO] image uplaoded: ${url}`)

      const IgPublisherInstance = new IgPublisher({profileName, accessToken})
      const res = await IgPublisherInstance.process({
        text: title,
        media: { photo: url}
      })
      console.log(`[INFO] done buffer publish ${filename}`)
    }
    catch(err){
      console.log(err)
      console.log('[ERROR] for loop')
      return
    }
  }
})()