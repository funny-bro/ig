(async function(){
  const cmd = require('@pscraper/cmd')
  const {onlyCharDigit} = require('../../utils/string')
  const fs = require('fs')
  const taskDir = '@mit'

  try {
    fs.mkdirSync(`./${taskDir}`)
    fs.mkdirSync(`./${taskDir}/trash`)
  }
  catch(err){
    console.log('[ERROR] @mit is existed')
  }

  const getPageId = (url) => {
    return onlyCharDigit(url.split('/').slice(-2).join(''))
  }

  const entryList = [
    'https://visualizingcultures.mit.edu/rise_fall_canton_04/cw_gal_02_thumb.html',
    'https://visualizingcultures.mit.edu/rise_fall_canton_04/cw_gal_03_thumb.html',
    'https://visualizingcultures.mit.edu/rise_fall_canton_04/cw_gal_04_thumb.html',
    'https://visualizingcultures.mit.edu/opium_wars_01/patna_shiva_lal.html',
    'https://visualizingcultures.mit.edu/opium_wars_01/chinese_war.html',
    'https://visualizingcultures.mit.edu/opium_wars_01/ow1_gallery.html',
    'https://visualizingcultures.mit.edu/garden_perfect_brightness_03/ymy3_gallery_1.html',
    'https://visualizingcultures.mit.edu/opium_wars_japan/oje_gallery.html',
  ]

  for(let i = 0; i< entryList.length; i++) {
    const entry = entryList[i]
    const id = getPageId(entry)

    if(fs.existsSync(`./${taskDir}/task-${id}.json`)) {
      console.log(`[INFO] task already existed ./${taskDir}/task-${id}.json`)
      continue
    }

    try {
      await cmd(`npx @pscraper/scraper --config=./script/mit.scraper/mit.config.js --entry=${entry} --taskDir=./${taskDir} --id=${id}`)
    }
    catch(err){
      i -=1
      continue
    }
  }


  let totalTask = []
  for(let i = 0; i< entryList.length; i++) {
    const entry = entryList[i]
    const id = getPageId(entry)
    const jsonString = fs.readFileSync(`./${taskDir}/task-${id}.json`)
    const jsonList = JSON.parse(jsonString)
    totalTask = [
      ...jsonList
    ]
  }
  fs.writeFileSync(`./${taskDir}/task.json`, JSON.stringify(totalTask))
  // for(let i = 0; i< entryList.length; i++) {
  //   const _fileList = fs.readFileSync(`${__dirname}/../../@pscraper.mit-list-temp/imageList.json`)
  //   const fileList = JSON.parse(_fileList)

  //   for(const item of fileList) {
  //     const {title, url} = item
  //     try{
  //       await cmd(`npx @pscraper/scraper --config=./script/mit.scraper/mit.download.image.js --url=${url}`)
  //     }
  //     catch(err){
  //       console.log(err)
  //       continue
  //     }
  //   }
  // }
})()