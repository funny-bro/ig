const watermark = require('../../utils/watermark')

test('sentence', async ()=> {
  const souce = './__tests__/mock/bigImg.jpg'
  const logo = './images/logo400X100.png'
  const output = './peter.jpg'
  const result = await watermark(souce, logo, {output})
  console.log(result)
})
