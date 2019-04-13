const translate = require('@vitalets/google-translate-api');
 
const translateApi = (sourceText) => {
  return translate(sourceText, {to: 'zh-TW'}).then((res)=>{
    return res.text
  })
}

module.exports = translateApi