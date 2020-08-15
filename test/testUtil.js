const fs = require('fs')
const path = require('path')
const logger = require('../src/logger/logger')
const fileHandler = require('../src/service/fileHandler')
module.exports = {
  clearAll
}

async function clearAll () {
  return new Promise(function (resolve, reject) {
    const dataDir = fileHandler.getDataDirectoryPath()
    console.log(dataDir)
    fs.readdir(dataDir, (err, files) => {
      if (err) throw err
      for (const file of files) {
        try {
          fs.unlinkSync(path.join(dataDir, file))
        } catch (e) {
          logger.error(`failed to remove file ${JSON.stringify(e)}`)
          return reject(e)
        }
      }
      return resolve()
    })
  })
}
