const onlyCharDigit = (str = '') => {
  return str.replace(/[^a-zA-Z0-9]/g, "")
}

const urlFileName = (url = '') => {
  if(!url) return ''
  return url.substring(url.lastIndexOf('/')+1);
}

const urlDomain = (url = '') => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  return matches && matches[1];
}

const pad = (num, size) => {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const retrieveObject = (dataObj, iterableString = '') => {
  if(!iterableString) return dataObj

  if(!dataObj) return null

  const currentString = iterableString.split('.')[0]

  if(currentString.includes('[') && currentString.includes(']')){
    const key = iterableString.split('[')[0]
    const index = currentString.split('[').pop().split(']')[0];
    const indexOfNext = iterableString.indexOf('].')
    const _nextIterableString = iterableString.slice(indexOfNext+2)  // included '.'

    if(!dataObj[key]) return null

    return retrieveObject(dataObj[key][index], _nextIterableString)
  }

  const nextIterableString = iterableString.split('.').slice(1).join('.')
  return retrieveObject(dataObj[currentString], nextIterableString)
}

const limitLength = (str = '', n=20) => {
  return str.slice(-n)
}

module.exports ={
  onlyCharDigit,
  urlFileName,
  urlDomain,
  pad,
  retrieveObject,
  limitLength
}