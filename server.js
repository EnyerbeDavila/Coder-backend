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
const { createTransport } = require('nodemailer')
const twilio = require('twilio')

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

  const client = twilio('ACcb494a938044df715fa5655af67bcabd', 'bc86ceb2481af3e52aae12b356653d6a')

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

  const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'felipegustaamante@gmail.com',
      pass: 'sczmnnkiqzhemcni'
    }
  })

  async function CRUD() {
    try {
      let rta = await mongoose.connect('mongodb+srv://user3:Asd.123@cluster0.qku2u.mongodb.net/mydata?retryWrites=true&w=majority', {
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
        mongoUrl: `mongodb+srv://user2:asd@cluster0.qku2u.mongodb.net/sessions?retryWrites=true&w=majority`,
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
              let usuario = req.body
              try {
                const info = await transporter.sendMail(
                  {
                    from: 'Coder-Backend',
                    to: 'felipegustaamante@gmail.com',
                    subject: 'Nuevo registro',
                    html: `Nuevo Registro: nombre: ${usuario.nombre}, email: ${username}, edad: ${usuario.edad}, numero telefonico: ${usuario.NuTelefonico}`
                  }
                )
              } catch (error) {
                console.log(err)
              }
              await new modelUser({ username: username, password: hash, nombre: usuario.nombre, edad: usuario.edad, NuTelefonico: usuario.NuTelefonico, urlAvatar: usuario.UrlAvatar, carrito: [] }).save()
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
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo(res)
  })

  app.get('/Fallo2', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo2(res)
  })

  app.get('/login', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    login(req, res)
  })

  app.post('/login',
    // (req, res, next) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    //   next()
    // },
    passport.authenticate('login',
      {
        successRedirect: '/',
        failureRedirect: '/Fallo'
      })
  )
  app.get('/informacion-perso', (req, res, next) => {
    if (req.user == undefined) {
      res.redirect('/login')
    } else {
      next()
    }
  }, (req, res) => {
    let user = req.user.username
    let usuario = modelUser.find({ username: user }, function (err, docs) {
      if (err) {
        console.log(err)
      } else {
        res.render('info-usuario.ejs', { username: user, nombre: docs[0].nombre, telefono: docs[0].NuTelefonico, foto: docs[0].urlAvatar, edad: docs[0].edad, correo: docs[0].username })
      }
    })
  })
  app.get('/products-user', (req, res, next) => {
    if (req.user == undefined) {
      res.redirect('/login')
    } else {
      next()
    }
  }, (req, res) => {
    let user = req.user.username
    let usuario = modelUser.find({ username: user }, function (err, docs) {
      if (err) {
        console.log(err)
      } else {
        res.render('productos.ejs', { username: user, nombre: docs[0].nombre, foto: docs[0].urlAvatar })
      }
    })
  })
  app.get('/registro', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderRegis(res)
  })

  app.post('/registro', (req, res, next) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    next()
  }, passport.authenticate('registro',
    {
      successRedirect: '/login',
      failureRedirect: '/Fallo2'
    })
  )

  app.post('/log-out', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    let user = req.user.username
    let usuario = modelUser.find({ username: user }, function (err, docs) {
      if (err) {
        console.log(err)
      } else {
        let nombre = docs[0].nombre
        RenderLogout(req, res, nombre)
      }
    })
  })

  app.get('/', (req, res, next) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    if (req.user == undefined) {
      res.redirect('/login')
    } else {
      next()
    }
  }, (req, res) => {
    let user = req.user.username
    let usuario = modelUser.find({ username: user }, function (err, docs) {
      if (err) {
        console.log(err)
      } else {
        let nombre = docs[0].nombre
        let foto = docs[0].urlAvatar
        RenderPrinc(req, res, nombre, foto)
      }
    })
  }
  )

  app.get('/info', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
  })

  app.get('/infozip', compression(), (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
  })

  app.get('/api/randoms', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    NumberRandoms(req, res)
  })

  app.get('/api/productos-test', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    ProductosTest(res)
  })

  app.use((req, res) => {
    // logWarning.warn(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
    res.send(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
  })

  io.on('connection', socket => {


    socket.on('BuyCar', (user) => {
    //   let usuario = modelUser.find({ username: user }, function (err, docs) {
    //     if (err) {
    //       console.log(err)
    //     } else {
    //       try {
    //         const info = transporter.sendMail(
    //           {
    //             from: 'Coder-Backend',
    //             to: '',
    //             subject: `Nuevo pedido de ${docs[0].nombre} - ${user}`,
    //             html: `El usuario ${docs[0].nombre} de correo ${user} solicito: ${docs[0].carrito}`
    //           }
    //         )
    //       } catch (error) {
    //         console.log(err)
    //       }
    //       try {
    //         const message = client.messages.create({
    //           body: `Nuevo pedido del usuario ${docs[0].nombre} de correo ${user} solicito:  ${docs[0].carrito}`,
    //           from: '',
    //           to: ''
    //         }).done();
    //       } catch (error) {
    //         console.log(error)
    //       }
    //       try {
    //         const message = client.messages.create({
    //           body: `Su pedido fue recibido y esta en proceso`,
    //           from: '',
    //           to: ''
    //         }).done();
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    //   })
    })

    socket.on('rendercarro', (user) => {
      let usuario = modelUser.find({ username: user }, function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          socket.emit('renderCarro', { carrito: docs[0].carrito, user: user })
        }
      })
    })

    socket.on('deleteProduct', (data) => {
      let usuario = modelUser.find({ username: data.user }, function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          let carro = docs[0].carrito
          let indice = carro.indexOf(data.producto)
          carro.splice(indice, 1)
          async function Product() {
            let Productos = await modelUser.updateOne({ username: data.user }, {
              $set: { carrito: carro }
            })
          }
          Product()
          socket.emit('renderCarro', { carrito: carro, user: data.user })
        }
      })
    })

    socket.on('AddCarro', (objeto) => {
      let usuario = modelUser.find({ username: objeto.username }, function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          let carro = docs[0].carrito
          carro.push(objeto.producto)
          async function Product() {
            let Productos = await modelUser.updateOne({ username: objeto.username }, {
              $set: { carrito: carro }
            })
          }
          Product()
          socket.emit('renderCarro', { carrito: carro, user: objeto.username })
        }
      })
    })

    //   async function mensaje() {
    //     let Post = await modelPost.find()
    //     socket.emit('messages', Post)
    //   }
    //   mensaje()

    //   knex
    //     .from('productos')
    //     .select('*')
    //     .then((productos) => {
    //       socket.emit('product', productos)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })

    //   socket.on('new-message', (post) => {
    //     post.fecha = moment().format('(DD/MM/YYYY hh:mm:ss a)')
    //     const author = new normalizr.schema.Entity('author')
    //     const comment = new normalizr.schema.Entity('comment')
    //     const fecha = new normalizr.schema.Entity('fecha')
    //     const organigrama = new normalizr.schema.Entity('organigrama', [{
    //       author: author,
    //       text: comment,
    //       fecha: fecha
    //     }], { idAttribute: 'id' })
    //     const autores = new normalizr.schema.Array(organigrama)

    //     const normalizado = normalizr.normalize(post, autores)

    //     async function send() {
    //       await new modelPost(normalizado).save()
    //       let Post = await modelPost.find()
    //       console.log(Post)
    //       io.sockets.emit('messages', Post)
    //     }
    //     send()
    //   })
    //   socket.on('new-product', (producto) => {
    //     knex('productos')
    //       .insert(producto)
    //       .then(() => {
    //         console.log("producto agregado")
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //     knex
    //       .from('productos')
    //       .select('*')
    //       .then((productos) => {
    //         io.sockets.emit('product', productos)
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })
    // })
  })
}