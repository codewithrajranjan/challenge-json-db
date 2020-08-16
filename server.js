const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const api = require('./api')
const createStudentAPI = require('./src/api/createStudent')
const getStudentAPI = require('./src/api/getStudent')
const deleteStudentAPI = require('./src/api/deleteStudent')
const middleware = require('./middleware')

const PORT = config.SERVER_PORT

const app = express()

app.use(bodyParser.json())

app.get('/health', api.getHealth)
app.put('/:studentId/*', createStudentAPI.createStudent)
app.get('/:studentId/*', getStudentAPI.getStudent)
app.delete('/:studentId/*', deleteStudentAPI.deleteStudent)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
