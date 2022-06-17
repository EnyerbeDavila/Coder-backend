const express = require('express')
const moment = require("moment")
const util = require('util')
const mongoose = require("mongoose")
const modelPost = require("./models/schemaPost")
const modelUser = require('./models/schemaUser')
const normalizr = require('normalizr')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { options } = require('./options/mariaDB')
const knex = require('knex')(options)
const connectMongo = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const config = require('./config')
const parseArgs = require('minimist')
const os = require('os')
const cluster = require('cluster')
const compression = require('compression')
const log4js = require('log4js')

const optionsMini = { default: { puerto: '8080', modo: 'FORK' } }
const args = parseArgs(process.argv, optionsMini)
const modo = args.modo
const PORT = args.puerto

if (modo == 'CLUSTER' && cluster.isPrimary) {
  const cantNucleos = os.cpus().length
  console.log(`numeros de cpus = ${cantNucleos}`)
  for (let i = 0; i < cantNucleos; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker) => {
    console.log(`El proceso de id: ${worker.process.pid}, murio`)
    cluster.fork()
  })
} else {

  log4js.configure({
    appenders: {
      miLoggerConsole: { type: 'console' },
      miWarnFile: { type: 'file', filename: 'warn.log' },
      miErrorFile: { type: 'file', filename: 'error.log' },
    },
    categories: {
      default: { appenders: ['miLoggerConsole'], level: 'all' },
      loginfo: { appenders: ['miLoggerConsole'], level: 'info' },
      logwn: { appenders: ['miWarnFile', 'miLoggerConsole'], level: 'warn' },
      logerr: { appenders: ['miErrorFile', 'miLoggerConsole'], level: 'error' },
    },
  })

  const logWarning = log4js.getLogger('logwn')
  const logError = log4js.getLogger('logerr')
  const logInfo = log4js.getLogger('loginfo')

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
        mongoUrl: `mongodb+srv://${config.User}:${config.password}@cluster0.qku2u.mongodb.net/sessions?retryWrites=true&w=majority`,
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
            const user = { username: docs[0].username }
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

  const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
  })
  connectedServer.on('error', error => console.log(`Error en servidor ${error}`))


  const { RenderFallo, RenderFallo2, login, RenderRegis, RenderLogout,
    RenderPrinc, SendInfo, NumberRandoms, ProductosTest } = require('./Daos/dao')

  // knex.schema
  //   .createTable('productos', (table) => {
  //     table.string('nombre', 20).notNullable()
  //     table.integer('precio', 7)
  //     table.string('urlfoto', 500)
  //   })
  //   .then(() => console.log('table creada'))
  //   .catch((err) => console.log(err))

  app.get('/Fallo', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo(res)
  })

  app.get('/Fallo2', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo2(res)
  })

  app.get('/login', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    login(req, res)
  })

  app.post('/login', (req, res, next) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    next()
  }, passport.authenticate('login',
    {
      successRedirect: 'http://localhost:8080',
      failureRedirect: '/Fallo'
    })
  )

  app.get('/registro', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderRegis(res)
  })

  app.post('/registro', (req, res, next) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    next()
  }, passport.authenticate('registro',
    {
      successRedirect: '/login',
      failureRedirect: '/Fallo2'
    })
  )

  app.post('/log-out', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderLogout(req, res)
  })

  app.get('/', (req, res, next) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    if (req.user == undefined) {
      res.redirect('/login')
    } else {
      next()
    }
  }, (req, res) => {
    RenderPrinc(req, res)
  }
  )

  app.get('/info', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
  })

  app.get('/infozip', compression(), (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
  })

  app.get('/api/randoms', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    NumberRandoms(req, res)
  })

  app.get('/api/productos-test', (req, res) => {
    logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    ProductosTest(res)
  })

  app.use((req, res) => {
    logWarning.warn(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
    res.send(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
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
}

