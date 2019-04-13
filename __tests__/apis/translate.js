const tran = require('../../apis/translate')

test('sentence', async ()=> {
  const result = await tran('I love you ')
  expect(result).toBe('我愛你')
})

test('new line', async ()=> {
  const result = await tran('I love you \n 2')
  expect(result.includes('我愛你')).toBe(true)
  expect(result.includes('2')).toBe(true)
})

test('new line x2', async ()=> {
  const result = await tran('I love you \n 2 \n 3')
  expect(result.includes('我愛你')).toBe(true)
  expect(result.includes('2')).toBe(true)
  expect(result.includes('3')).toBe(true)
})

test('営みの消えた島に残った教会。', async () => {
  const result = await tran('営みの消えた島に残った教会。')
  expect(result.includes('教堂離開了島上生命消失的地方')).toBe(true)
})
