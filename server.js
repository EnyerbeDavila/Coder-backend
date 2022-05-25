const express = require('express')
const moment = require("moment")
const util = require('util')
const mongoose = require("mongoose")
const modelPost = require("./models/schemaPost")
const modelUser = require('./models/schemaUser')
const { faker } = require('@faker-js/faker')
faker.locale = 'es'
const normalizr = require('normalizr')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { options } = require('./options/mariaDB')
const knex = require('knex')(options)
const connectMongo = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')
const console = require('console')
const { JSON } = require('mysql/lib/protocol/constants/types')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


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
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')

passport.use('login', new LocalStrategy((username, password, done) => {
  let usuario = modelUser.find({ username: username }, function (err, docs) {
    if (docs.length == 0) {
      return done(null, false)
    } else {
      bcrypt.compare(password, docs[0].password, function (err, result) {
        if (result == true) {
          const user = { username: docs[0].username}
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    }
  })
})
)

passport.use('registro', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      let usuarioscont = modelUser.find({ username: username }, function (err, docs) {
        if (docs.length == 0) {
          async function send() {
            await new modelUser({ username: username, password: hash }).save()
            return done(null, { username: username })
          }
          send()
        } else {
          return done(null, false)
        }
      })
    });
  });
}
))

passport.serializeUser((usuario, done) => {
  done(null, usuario.username)
})

passport.deserializeUser((username, done) => {
  let usuario = modelUser.find({ username: username }, function (err, docs) {
    const user = { username: docs[0].username, password: docs[0].password }
    done(null, user)
  })
})

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

app.get('/Fallo', (req, res) => {
  res.render('login-error.ejs')
})

app.get('/Fallo2', (req, res) => {
  res.render('Regis-error.ejs')
})

app.get('/login', (req, res) => {
  req.logOut()
  res.render('formularioLog.ejs')
})

app.post('/login', passport.authenticate('login',
  {
    successRedirect: 'http://localhost:8080',
    failureRedirect: '/Fallo'
  })
)

app.get('/registro', (req, res) => {
  res.render('formularioRegist.ejs')
})

app.post('/registro', passport.authenticate('registro',
  {
    successRedirect: '/login',
    failureRedirect: '/Fallo2'
  })
)

app.post('/log-out', (req, res) => {
  let user = req.user.username
  res.render('Bye.ejs', { user: user })
})

app.get('/', (req, res, next) => {
  if (req.user == undefined) {
    res.redirect('/login')
  } else {
    next()
  }
}, (req, res) => {
  let user = req.user.username
  res.render('index.ejs', { nombre: user })
}
)

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
      console.log(Post)
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

