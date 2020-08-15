const logger = require('../logger/logger')
const utils = require('underscore')
const messages = require('../helpers/message')
const studentService = require('../service/studentService')
module.exports = {
  createStudent
}

async function createStudent (req, res, next) {
  const studentId = req.params.studentId
  const propertyPath = req.params[0]
  const requestData = req.body
  logger.info(`create student request studentId = ${studentId} propertyPath = ${propertyPath} data = ${JSON.stringify(requestData)}`)

  if (utils.isEmpty(requestData)) {
    return res.status(400).json({ success: false, message: messages.REQUEST_BODY_MANDATORY })
  }
  const studentExists = await studentService.studentExists(studentId)

  if (!studentExists) {
    logger.info(`creating new student with id ${studentId}`)
    const result = await studentService.createStudent(studentId, requestData)
    if (result) {
      return res.status(200).json({ success: true, message: messages.STUDENT_CREATED })
    } else {
      return res.status(500).json({ success: false, message: messages.STUDENT_CREATE_FAILED })
    }
  }

  const updateStudentResult = await studentService.updateStudent(studentId, propertyPath, requestData)

  if (!updateStudentResult) {
    return res.status(500).json({ success: false, message: messages.STUDENT_UPDATE_FAILED })
  }
  res.status(200).json({ success: true, message: messages.STUDENT_UPDATED })
}
