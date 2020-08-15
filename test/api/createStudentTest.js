const tape = require('tape')
const config = require('../../config')
const jsonist = require('jsonist')
const messages = require('../../src/helpers/message')
const endpoint = `http://localhost:${config.SERVER_PORT}`
const fileHandler = require('../../src/service/fileHandler')
const testUtil = require('../testUtil')
const server = require('../../server')

tape('should return error when no data is provided', async function (t) {
  const url = `${endpoint}/student123/`
  jsonist.put(url, {}, (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 400)
    t.false(body.success)
    t.equal(body.message, messages.REQUEST_BODY_MANDATORY)
    t.end()
  })
})

tape('should create student if it is not present', async function (t) {
  await testUtil.clearAll()
  const url = `${endpoint}/student123/`
  const studentData = {
    name: 'test',
    age: 20,
    address: { street: { number: 10 } }
  }
  jsonist.put(url, studentData, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_CREATED)
    const actualStudent = await fileHandler.readFile('student123')
    t.equal(JSON.stringify(actualStudent), JSON.stringify(studentData))
    t.end()
  })
})

tape('should create nested student property if student exists and property is not present', async function (t) {
  await testUtil.clearAll()
  const url = `${endpoint}/student123/address/street/`
  const student = {
    name: 'test',
    age: 20,
    address: { street: { number: 10 } }
  }
  await fileHandler.writeFile('student123', student)

  const dataToSend = { location: 'USA' }
  jsonist.put(url, dataToSend, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_UPDATED)
    const acutalStudent = await fileHandler.readFile('student123')
    const expectedStudent = {
      name: 'test',
      age: 20,
      address: { street: { number: 10, location: 'USA' } }
    }
    t.equal(JSON.stringify(acutalStudent), JSON.stringify(expectedStudent))
    t.end()
  })
})

tape('should update nested student property if student exists and property is  present', async function (t) {
  await testUtil.clearAll()
  const url = `${endpoint}/student123/address/street/`
  const student = {
    name: 'test',
    age: 20,
    address: { street: { number: 10, location: ['USA'] } }
  }
  await fileHandler.writeFile('student123', student)

  const dataToSend = { location: ['IND', 'AF'] }
  jsonist.put(url, dataToSend, async (err, body, response) => {
    if (err) t.error(err)
    t.equal(response.statusCode, 200)
    t.true(body.success)
    t.equal(body.message, messages.STUDENT_UPDATED)
    const actualStudent = await fileHandler.readFile('student123')
    const expectedStudent = {
      name: 'test',
      age: 20,
      address: { street: { number: 10, location: ['IND', 'AF'] } }
    }
    t.equal(JSON.stringify(actualStudent), JSON.stringify(expectedStudent))
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
