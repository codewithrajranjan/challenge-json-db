const fs = require('fs')
const path = require('path')
const util = require('util')
const logger = require('../logger/logger')
const fsWriteFile = util.promisify(fs.writeFile)
const fsFileAccess = util.promisify(fs.access)
const fsReadFile = util.promisify(fs.readFile)
const fsUnlink = util.promisify(fs.unlink)
const jsonHandler = require('nested-property')
const config = require('../../config')
module.exports = {
  writeFile,
  updateFile,
  fileExists,
  readFile,
  getFilePath,
  getDataDirectoryPath,
  propertyExists,
  getPropertyValue,
  deleteFileById,
  deleteProperty
}

async function deleteFileById (fileId) {
  const filePath = getFilePath(fileId)
  try {
    logger.info(`deleting file with id ${fileId}`)
    await fsUnlink(filePath)
    return true
  } catch (e) {
    logger.error(`failed to delete file with id ${fileId} with error ${JSON.stringify(e)}`)
    return false
  }
}

async function propertyExists (fileId, path) {
  const fileData = await readFile(fileId)
  try {
    logger.debug(`searching property ${path} on file id${fileId}`)
    return jsonHandler.has(fileData, path)
  } catch (e) {
    logger.error(`failed to validate property ${path} on file id ${fileId} with error ${JSON.stringify(e)}`)
    return false
  }
}

async function getPropertyValue (fileId, propertyPath) {
  const fileData = await readFile(fileId)
  try {
    logger.debug(`find property-path ${propertyPath} for file id ${fileId}`)
    return jsonHandler.get(fileData, propertyPath)
  } catch (e) {
    logger.error(`failed to get property ${propertyPath} on file id ${fileId} with error ${JSON.stringify(e)}`)
    return false
  }
}

async function writeFile (fileId, data) {
  const filePath = getFilePath(fileId)
  try {
    await fsWriteFile(filePath, JSON.stringify(data))
    return true
  } catch (e) {
    logger.error(`file write error for file ${filePath} with error ${JSON.stringify(e)}`)
    return false
  }
}

async function readFile (fileId) {
  const filePath = getFilePath(fileId)
  try {
    const result = await fsReadFile(filePath)
    return JSON.parse(result)
  } catch (e) {
    logger.error(`file read error for file ${filePath} with error ${JSON.stringify(e)}`)
  }
}

async function fileExists (fileId) {
  const filePath = getFilePath(fileId)
  try {
    await fsFileAccess(filePath)
    return true
  } catch (e) {
    logger.error(`file doesn't exists on the path ${filePath}`)
    return false
  }
}

async function updateFile (fileId, path, data) {
  const fileData = await readFile(fileId)

  try {
    let propertyPath = ''
    for (const property in data) {
      if (path !== '') {
        propertyPath = `${path}.${property}`
      } else {
        propertyPath = property
      }
      jsonHandler.set(fileData, propertyPath, data[property])
    }
    await writeFile(fileId, fileData)
    return true
  } catch (e) {
    logger.error(`file update error for file id ${fileId} with error ${JSON.stringify(e)}`)
    return false
  }
}

async function deleteProperty (fileId, propertyPath) {
  let fileData = await readFile(fileId)
  try {
    deletePropertyPath(fileData, propertyPath)
    await writeFile(fileId, fileData)
  } catch (e) {
    logger.error(`failed to delete ${propertyPath} for file id ${fileId}`)
  }
}

function getDataDirectoryPath () {
  const projectRootDirectory = config.PROJECT_DIR
  return `${projectRootDirectory}${path.sep}data`
}

function getFilePath (fileId) {
  return `${getDataDirectoryPath()}${path.sep}${fileId}.json`
}

function deletePropertyPath (obj, path) {
  if (!obj || !path) {
    return
  }
  if (typeof path === 'string') {
    path = path.split('.')
  }
  for (let i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]]
    if (typeof obj === 'undefined') {
      return
    }
  }
  delete obj[path.pop()]
}
