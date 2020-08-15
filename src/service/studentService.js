const fileHandler = require('../service/fileHandler')
const logger = require('../../src/logger/logger')
const utils = require('underscore')
module.exports = {
  studentExists,
  createStudent,
  updateStudent
}

async function studentExists (studentId) {
  return fileHandler.fileExists(studentId)
}

async function createStudent (studentId, data) {
  return fileHandler.writeFile(studentId, data)
}

async function updateStudent (studentId, dataPath, data) {
  const propertyArray = dataPath.split('/')
  const sanitizedPropertyArray = []
  propertyArray.forEach(function (item) {
    if (!utils.isEmpty(item)) {
      sanitizedPropertyArray.push(item)
    }
  })
  const pathDotSeparated = sanitizedPropertyArray.join('.')
  logger.info(`update student with id ${studentId} for path ${pathDotSeparated}`)
  return fileHandler.updateFile(studentId, pathDotSeparated, data)
}
