//Initial config

const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const cors = require('cors')
const app = express()
const socket = require('socket.io')
require('dotenv').config()

//Initialize cors
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Read Json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./routes/index')(app)

// Inicialize port
const server = app.listen(process.env.PORT || 3333, () =>
  console.log('Server Running ' + 3333)
)

const io = socket(server, {
  cors: {
    origin: process.env.FRONT_URL,
    credentials: true
  }
})

global.onlineUsers = new Map()

io.on('connection', socket => {
  global.chatSocket = socket
  socket.on('add-user', userId => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', data => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.message)
    }
  })
})
