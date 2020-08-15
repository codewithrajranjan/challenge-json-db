const fileHandler = require('../src/service/fileHandler')
const fsExtra = require('fs-extra')
const logger = require('../src/logger/logger')
module.exports = {
  clearAll
}

async function clearAll () {
  const dataDir = fileHandler.getDataDirectoryPath()
  try {
    fsExtra.emptyDirSync(dataDir)
  } catch (e) {
    logger.error(`failed to clear directory ${dataDir}`)
    throw new Error(`Failed to clear directory ${dataDir} with error ${JSON.stringify(e)}`)
  }
}
