const axios = require('axios')
const urlUtil = require('./url')

const getCookieValue = (_cookies, key) => {
  return _cookies.cookies.find(item => item.name ===key).value
}

class IGApi {
  constructor(cookies){
    this.csrftoken = getCookieValue(cookies ,'csrftoken')
    this.sessionid = getCookieValue(cookies ,'sessionid')
  }

  getUser(userId) {
    const {csrftoken, sessionid} = this
    const url = `${urlUtil.ig.user(userId)}/?__a=1`
    const headers = { "cookie":`csrftoken=${csrftoken};sessionid=${sessionid};`}
    return axios(url, {
      "credentials":"include",
      headers,
      "referrerPolicy":"no-referrer-when-downgrade",
      "method":"GET"});
  }

  getLocation(locationId) {
    const {csrftoken, sessionid} = this
    const url = `${urlUtil.ig.location(locationId)}/?__a=1`
    const headers = { "cookie":`csrftoken=${csrftoken};sessionid=${sessionid};`}
    return axios(url, {
      "credentials":"include",
      headers,
      "referrerPolicy":"no-referrer-when-downgrade",
      "method":"GET"});
  }

  getShortCode(shortcode) {
    const {csrftoken, sessionid} = this
    const url = `${urlUtil.ig.shortCode(shortcode)}/?__a=1`
    const headers = { "cookie":`csrftoken=${csrftoken};sessionid=${sessionid};`}
    return axios(url, {
      "credentials":"include",
      headers,
      "referrerPolicy":"no-referrer-when-downgrade",
      "method":"GET"});
  }
}

module.exports = IGApi