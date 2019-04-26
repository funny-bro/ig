const Jimp = require('jimp')

const DEFAULT_LOGO_WIDTH = 400
const DEFAULT_LOGO_HEIGHT = 100

const COMPOSITE_CONFIG = {
  mode: Jimp.BLEND_MULTIPLY,
  opacitySource: 0.3,
  opacityDest: 0.9
}

const watermark = (sourcePath, logoPath, config = {}) => {
  const {output = 'output.jpg'} = config
  const p1 = Jimp.read(sourcePath);
  const p2 = Jimp.read(logoPath);
  
  return Promise.all([p1, p2]).then(images => {
    const baseImage= images[0]
    const logoImage = images[1]

    const width = baseImage.bitmap.width
    const height = baseImage.bitmap.height
    const margin = 50

    const x = width - margin - DEFAULT_LOGO_WIDTH
    const y = height - margin - DEFAULT_LOGO_HEIGHT

    return baseImage
      .composite(logoImage, x,y, COMPOSITE_CONFIG)
      .quality(80)
      .write(output);
  });
}

module.exports = watermark