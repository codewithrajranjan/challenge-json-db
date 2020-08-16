const fileHandler = require('../service/fileHandler')
const logger = require('../../src/logger/logger')
const utils = require('underscore')
module.exports = {
  studentExists,
  studentPropertyExists,
  createStudent,
  updateStudent,
  getStudentById,
  getStudentPropertyValue,
  deleteStudentById,
  deleteStudentProperty
}

async function deleteStudentById (studentId) {
  return fileHandler.deleteFileById(studentId)
}

async function studentExists (studentId) {
  return fileHandler.fileExists(studentId)
}

async function studentPropertyExists (studentId, propertyPath) {
  const pathDotSeparated = getDotSeparatedPath(propertyPath)
  return fileHandler.propertyExists(studentId, pathDotSeparated)
}

async function getStudentPropertyValue (studentId, propertyPath) {
  const pathDotSeparated = getDotSeparatedPath(propertyPath)
  return fileHandler.getPropertyValue(studentId, pathDotSeparated)
}

async function deleteStudentProperty (studentId, propertyPath) {
  const pathDotSeparated = getDotSeparatedPath(propertyPath)
  return fileHandler.deleteProperty(studentId, pathDotSeparated)
}

async function createStudent (studentId, data) {
  return fileHandler.writeFile(studentId, data)
}

async function updateStudent (studentId, dataPath, data) {
  const pathDotSeparated = getDotSeparatedPath(dataPath)
  logger.info(`update student with id ${studentId} for path ${pathDotSeparated}`)
  return fileHandler.updateFile(studentId, pathDotSeparated, data)
}

async function getStudentById (studentId) {
  return fileHandler.readFile(studentId)
}

function getDotSeparatedPath (path) {
  const propertyArray = path.split('/')
  const sanitizedPropertyArray = []
  propertyArray.forEach(function (item) {
    if (!utils.isEmpty(item)) {
      sanitizedPropertyArray.push(item)
    }
  })
  const pathDotSeparated = sanitizedPropertyArray.join('.')
  return pathDotSeparated
}
