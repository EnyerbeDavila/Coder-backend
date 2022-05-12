const express = require('express')
const moment = require("moment")
const util = require('util')
const mongoose = require("mongoose")
const modelPost = require("./models/schemaPost")
const { faker } = require('@faker-js/faker')
faker.locale = 'es'
const normalizr = require('normalizr')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { options } = require('./options/mariaDB')
const knex = require('knex')(options)
const connectMongo = require('connect-mongo')
const session = require('express-session')
const req = require('express/lib/request')
const res = require('express/lib/response')

async function CRUD() {
  try {
    const URL = "mongodb://127.0.0.1:27017/post"
    let rta = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("Base de Datos mongodb conectada")
  } catch (e) {
    console.log(e)
  }
}
CRUD()

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({
    store: connectMongo.create({
      mongoUrl: 'mongodb+srv://UserName:asd.456@cluster0.qku2u.mongodb.net/sessions?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 600
    }),
    secret: 'secreto',
    resave: true,
    saveUnitialized: true,

  })
)
// cookie: { maxAge: 600000 }
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

function auth(req, res, next) {
  if (req.session?.user === undefined) {
    res.redirect('http://localhost:8080/login')
  } else {
    next()
  }
}

app.get('/login', (req, res) => {
  res.render('formularioLog.ejs')
})

app.post('/login', (req, res) => {
  if (req.body.userName == "") {
    res.send('Ingrese un nombre de usuario')
  } else {
    req.session.user = req.body.userName
    res.redirect('http://localhost:8080')
  }
})

app.post('/log-out', (req, res) => {
  let user = req.session.user
  req.session.destroy((err) => {
    if (!err) res.render('Bye.ejs', {user: user})
    else res.send({ status: 'logout Error', error: err })
  })
})

app.get('/', auth, (req, res) => {
  let user = req.session.user
  res.render('index.ejs', { nombre: user })
})

app.get('/api/productos-test', (req, res) => {
  let productos = []
  for (let i = 0; i < 5; i++) {
    let producto = {}
    producto.Nombre = faker.commerce.product()
    producto.Precio = faker.commerce.price()
    producto.UrlFoto = faker.image.imageUrl()
    productos.push(producto)
  }
  res.send(JSON.stringify(productos))
})

io.on('connection', socket => {
  async function mensaje() {
    let Post = await modelPost.find()
    socket.emit('messages', Post)
  }
  mensaje()

  knex
    .from('productos')
    .select('*')
    .then((productos) => {
      socket.emit('product', productos)
    })
    .catch((err) => {
      console.log(err)
    })

  socket.on('new-message', (post) => {
    post.fecha = moment().format('(DD/MM/YYYY hh:mm:ss a)')
    const author = new normalizr.schema.Entity('author')
    const comment = new normalizr.schema.Entity('comment')
    const fecha = new normalizr.schema.Entity('fecha')
    const organigrama = new normalizr.schema.Entity('organigrama', [{
      author: author,
      text: comment,
      fecha: fecha
    }], { idAttribute: 'id' })
    const autores = new normalizr.schema.Array(organigrama)

    const normalizado = normalizr.normalize(post, autores)

    async function send() {
      await new modelPost(normalizado).save()
      let Post = await modelPost.find()
      io.sockets.emit('messages', Post)
    }
    send()
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

