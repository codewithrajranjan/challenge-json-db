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
  jsonist.delete(url, (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.end()
  })
})

tape('should delete full student profile when search path is empty', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student123'
  const data = { name: 'student-name', age: 20 }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/`
  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_DELETED)
    t.false(await fileHandler.fileExists(studentId))
    t.end()
  })
})

tape('should return error when delete path doesnt exist on first level keys of student data', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student123'
  const data = { name: 'student-name', age: 20 }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address`
  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.equal(body.message, messages.STUDENT_DELETE_PROPERTY_NOT_FOUND)
    t.end()
  })
})

tape('should return error when delete path doesnt exist on nested level keys of student data', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student1234'
  const data = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: ['USA'] } }
  }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address/street/block/`
  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 404)
    t.false(body.success)
    t.equal(body.message, messages.STUDENT_DELETE_PROPERTY_NOT_FOUND)
    t.end()
  })
})

tape('should delete top level property', async function (t) {
  await testUtil.clearAll()
  const studentId = 'stu'
  const data = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: { someKey: 20 } } }
  }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/age`
  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_PROPERTY_DELETED)
    const expectedStudent = {
      name: 'test',
      address: { street: { number: 10, location: { someKey: 20 } } }
    }
    t.equal(JSON.stringify(await fileHandler.readFile(studentId)), JSON.stringify(expectedStudent))
    t.end()
  })
})

tape('should delete nested level property', async function (t) {
  await testUtil.clearAll()
  const studentId = 'student111'
  const data = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: { someKey: 20 } } }
  }
  await fileHandler.writeFile(studentId, data)
  const url = `${endpoint}/${studentId}/address/street/location`
  jsonist.delete(url, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_PROPERTY_DELETED)
    const expectedStudent = {
      name: 'test',
      age: 20,
      address: { street: { number: 10 } }
    }
    t.equal(JSON.stringify(await fileHandler.readFile(studentId)), JSON.stringify(expectedStudent))
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
