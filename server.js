const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const api = require('./api')
const createStudentAPI = require('./src/api/createStudent')
const middleware = require('./middleware')

const PORT = config.SERVER_PORT

const app = express()

app.use(bodyParser.json())

app.get('/health', api.getHealth)
app.put('/:studentId/*', createStudentAPI.createStudent)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
