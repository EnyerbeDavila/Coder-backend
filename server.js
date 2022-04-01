const express = require('express')
const moment = require("moment")
const res = require('express/lib/response')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { get } = require('express/lib/response')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const router = express.Router()
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

const messages = []
const productos = []

app.get('/', (req, res) => {
    res.render('index.ejs', { productos:productos,mensajes:messages })
  })

io.on('connection', socket => {
  console.log('Nuevo cliente conectado!')

  socket.emit('messages', messages)

  socket.emit('product', productos)

  socket.on('new-message', (mensaje) => {
    mensaje.hora = moment().format('(DD/MM/YYYY hh:mm:ss a)')
    messages.push(mensaje)
    io.sockets.emit('messages', messages)
  })

  socket.on('new-product', (producto) => {
    productos.push(producto)
    io.sockets.emit('product', productos)
  })
})

