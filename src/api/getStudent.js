const logger = require('../logger/logger')
const studentService = require('../service/studentService')
const messages = require('../helpers/message')
const utils = require('underscore')
module.exports = {
  getStudent
}

async function getStudent (req, res, next) {
  const studentId = req.params.studentId
  const propertyPath = req.params[0]
  logger.info(`get student request studentId = ${studentId} propertyPath = ${propertyPath}`)

  const studentExists = await studentService.studentExists(studentId)

  if (!studentExists) {
    logger.error(`student doesn't exists with id ${studentId}`)
    return res.status(404).json({ success: false, message: messages.STUDENT_NOT_FOUND })
  }
  if (utils.isEmpty(propertyPath)) {
    logger.debug('property path in request is empty')
    logger.info(`fetching full profile of student for id ${studentId}`)
    const student = await studentService.getStudentById(studentId)
    return res.status(200).json({ success: true, message: messages.STUDENT_FOUND, data: student })
  }

  const studentPropertyExists = await studentService.studentPropertyExists(studentId, propertyPath)

  if (!studentPropertyExists) {
    logger.debug(`property ${propertyPath} doeesn't exist on student with id ${studentId}`)
    return res.status(404).json({ success: false, message: messages.STUDENT_PROPERTY_NOT_FOUND })
  }
  const studentData = await studentService.getStudentPropertyValue(studentId, propertyPath)
  return res.status(200).json({ success: true, message: messages.STUDENT_PROPERTY_FOUND, data: studentData })
}
