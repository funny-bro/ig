const email = process.env.BUFFER_USERNAME
const password = process.env.BUFFER_PASSWORD
const projectName = `@pscraper.buffer.login`
const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

module.exports = {
  name: projectName,
  url: 'https://buffer.com/signin',
  isDownloadCookies: true,
  // isDownloadResource: false,
  // downloadResourceType: [],
  afterPageLoad: async function(page){
    await page.goto('https://buffer.com/signin');
    await sleep(2)
    console.log(`[INFO] going to fill :${email}, ${password}`)
    await page.type('input[name=email]', email);
    await page.type('input[name=password]', password);
    await page.click('button[type=submit]');
    await sleep(5)
  },
}