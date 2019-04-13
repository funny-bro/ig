class Base {
  constructor(){
    this.data = {}
    this.res = {}
    this.sourceUrl = null
  }
  async fetchData(){
    this.beforeFetchData()
    this.res = {}
  }
  beforeFetchData(){
    return {}
  }
  afterFetchData(res){
    this.res = res
    return {...res}
  }
  parseData(res){
    return {...res}
  }
  async process(){
    const res = await this.fetchData()
    await this.afterFetchData(res)

    if(!this.sourceUrl) throw '[ERROR] apiScraper Base, this.sourceUrl is required'
    
    const data = this.parseData(res)
    return data
  }
}


module.exports = Base