const express = require('express')
const moment = require("moment")
const res = require('express/lib/response')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { get } = require('express/lib/response')
const { options } = require('./options/mariaDB')
const knex = require('knex')(options)
const knexLite3 = require('knex')({
  client: 'sqlite3',
  connection: { filename: './ecommerce/mydb.sqlite' },
  useNullAsDefault: true
})

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

// knex.schema
//   .createTable('productos', (table) => {
//     table.string('nombre', 20).notNullable()
//     table.integer('precio', 7)
//     table.string('urlfoto', 500)
//   })
//   .then(() => console.log('table creada'))
//   .catch((err) => console.log(err))

// knexLite3.schema
//   .createTable('mensajes', (tabla) => {
//     tabla.string('email', 30).notNullable()
//     tabla.string('fecha', 40)
//     tabla.string('mensaje', 500)
//   })
//   .then(() => console.log('table creada'))
//   .catch((err) => console.log(err))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

io.on('connection', socket => {
  console.log('Nuevo cliente conectado!')

  knexLite3
    .from('mensajes')
    .select('*')
    .then((mensajes) => {
      socket.emit('messages', mensajes)
    })
    .catch((err) => {
      console.log(err)
    })

  knex
    .from('productos')
    .select('*')
    .then((productos) => {
      socket.emit('product', productos)
    })
    .catch((err) => {
      console.log(err)
    })

  socket.on('new-message', (mensaje) => {
    let mensajes = []
    mensaje.fecha = moment().format('(DD/MM/YYYY hh:mm:ss a)')
    mensajes.push(mensaje)
    knexLite3('mensajes')
      .insert(mensaje)
      .then(() => {
        console.log('mensaje agregado')
      })
      .catch((err) => {
        console.log(err)
      })
    knexLite3
      .from('mensajes')
      .select('*')
      .then((mensajes) => {
        io.sockets.emit('messages', mensajes)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  socket.on('new-product', (producto) => {
    knex('productos')
      .insert(producto)
      .then(() => {
        console.log("producto agregado")
      })
      .catch((err) => {
        console.log(err)
      })
    knex
      .from('productos')
      .select('*')
      .then((productos) => {
        io.sockets.emit('product', productos)
      })
      .catch((err) => {
        console.log(err)
      })
  })
})

