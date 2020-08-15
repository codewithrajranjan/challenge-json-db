const tape = require('tape')
const config = require('../../config')
const jsonist = require('jsonist')
const messages = require('../../src/helpers/message')
const endpoint = `http://localhost:${config.SERVER_PORT}`
const fileHandler = require('../../src/service/fileHandler')
const testUtil = require('../testUtil')
const server = require('../../server')

tape('should return error when the student doesnt exists', async function (t) {
  await testUtil.clearAll()
  const url = `${endpoint}/student123/`
  jsonist.get(url, (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.end()
  })
})

tape('should return full student profile when search path is empty', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student123'
  const data = { name: 'student-name', age: 20 }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/`
  jsonist.get(url, (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_FOUND)
    t.equal(JSON.stringify(body.data), JSON.stringify(data))
    t.end()
  })
})

tape('should return error when search path doesnt exist on first level keys of student data', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student123'
  const data = { name: 'student-name', age: 20 }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address`
  jsonist.get(url, (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.equal(body.message, messages.STUDENT_PROPERTY_NOT_FOUND)
    t.end()
  })
})

tape('should return error when search path doesnt exist on nested level keys of student data', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student1234'
  const data = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: ['USA'] } }
  }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address/street/block/`
  jsonist.get(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.equal(body.message, messages.STUDENT_PROPERTY_NOT_FOUND)
    t.end()
  })
})

tape('should return value of the nested level keys', async function (t) {
  await testUtil.clearAll()
  const studentId = 'stu'
  const data = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: { someKey: 20 } } }
  }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address/street/location`
  jsonist.get(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_PROPERTY_FOUND)
    t.equal(JSON.stringify(body.data), JSON.stringify({ someKey: 20 }))
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
