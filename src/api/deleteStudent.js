const logger = require('../logger/logger')
const studentService = require('../service/studentService')
const messages = require('../helpers/message')
const utils = require('underscore')
module.exports = {
  deleteStudent
}

async function deleteStudent (req, res, next) {
  const studentId = req.params.studentId
  const propertyPath = req.params[0]
  logger.info(`delete student request studentId = ${studentId} propertyPath = ${propertyPath}`)

  const studentExists = await studentService.studentExists(studentId)

  if (!studentExists) {
    logger.error(`student doesn't exists with id ${studentId}`)
    return res.status(404).json({ success: false, message: messages.STUDENT_NOT_FOUND })
  }
  if (utils.isEmpty(propertyPath)) {
    logger.info(`deleting full profile of student for id ${studentId}`)
    const result = await studentService.deleteStudentById(studentId)
    if (result) {
      return res.status(200).json({ success: true, message: messages.STUDENT_DELETED })
    } else {
      return res.status(500).json({ success: false, message: messages.STUDENT_DELETED_FAILED })
    }
  }

  const studentPropertyExists = await studentService.studentPropertyExists(studentId, propertyPath)

  if (!studentPropertyExists) {
    logger.debug(`property ${propertyPath} doesn't exist on student with id ${studentId}`)
    return res.status(404).json({ success: false, message: messages.STUDENT_DELETE_PROPERTY_NOT_FOUND })
  }
  const studentData = await studentService.deleteStudentProperty(studentId, propertyPath)
  return res.status(200).json({ success: true, message: messages.STUDENT_PROPERTY_DELETED, data: studentData })
}
