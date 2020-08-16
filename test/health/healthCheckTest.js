const tape = require('tape')
const config = require('../../config')
const jsonist = require('jsonist')

const port = config.SERVER_PORT
const endpoint = `http://localhost:${port}`

const server = require('../../server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
