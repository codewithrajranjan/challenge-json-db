const tape = require('tape')
const fileHandler = require('../../src/service/fileHandler')
const testUtil = require('../testUtil')

tape('should be able to write file successfully', async function (t) {
  await testUtil.clearAll()
  const fileId = 'test_file_id'
  const data = { message: 'ok' }

  const actualResult = await fileHandler.writeFile(fileId, data)

  t.true(actualResult)
  t.true(await fileHandler.fileExists(fileId))
  t.end()
})

tape('should be able to read file', async function (t) {
  await testUtil.clearAll()
  const fileId = 'test_file_update'
  const data = { message: 'ok' }
  await fileHandler.writeFile(fileId, data)

  const result = await fileHandler.readFile(fileId)

  t.equal(JSON.stringify(result), JSON.stringify(data))
  t.end()
})

tape('should be able to update the top level key in file', async function (t) {
  await testUtil.clearAll()
  const fileId = 'test_file_update'
  const data = { message: 'ok' }
  await fileHandler.writeFile(fileId, data)

  let result = await fileHandler.updateFile(fileId, '', { message: 'all-ok' })

  t.true(result)
  result = await fileHandler.readFile(fileId)
  const expectedJSON = { message: 'all-ok' }
  t.equal(JSON.stringify(result), JSON.stringify(expectedJSON))
  t.end()
})

tape('should be able to update the nested level key in file', async function (t) {
  await testUtil.clearAll()
  const fileId = 'test_file_update'
  const data = { message: 'ok', address: { street: { number: 10 } } }
  await fileHandler.writeFile(fileId, data)

  let result = await fileHandler.updateFile(fileId, 'address.street', { number: 20 })

  t.true(result)
  result = await fileHandler.readFile(fileId)
  const expectedJSON = { message: 'ok', address: { street: { number: 20 } } }
  t.equal(JSON.stringify(result), JSON.stringify(expectedJSON))
  t.end()
})
