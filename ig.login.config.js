const email = process.env.IG_USERNAME
const password = process.env.IG_PASSWORD

const sleep = (s) => new Promise((resolve)=> setTimeout(resolve, s*1000))

module.exports = {
  name: `ig.login`,
  url: 'https://www.instagram.com/ageofstory/?hl=en',
  isDownloadCookies: true,
  // isDownloadResource: true,
  // downloadResourceType: [],
  // afterPageLoad: scrollDown,
  beforeGotoPage: async function(page){
    await page.goto('https://www.instagram.com/accounts/login/?hl=en&source=auth_switcher');
    await sleep(3)
    await page.type('input[name=username]', email);
    await page.type('input[name=password]', password);
    await page.click('button[type=submit]');
    await sleep(2)
  }
}