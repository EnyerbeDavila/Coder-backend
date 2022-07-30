const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const connectMongo = require('connect-mongo')
const session = require('express-session')
const parseArgs = require('minimist')
const os = require('os')
const cluster = require('cluster')
const log4js = require('log4js')
// const { createTransport } = require('nodemailer')
// const twilio = require('twilio')

const routerPrinc = require('./router/routerPrinc')

const optionsMini = { default: { puerto: '8080', modo: 'FORK' } }
const args = parseArgs(process.argv, optionsMini)
const modo = args.modo
const PORT = process.env.port || args.puerto

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

  // const client = twilio('ACcb494a938044df715fa5655af67bcabd', 'bc86ceb2481af3e52aae12b356653d6a')

  // log4js.configure({
  //   appenders: {
  //     miLoggerConsole: { type: 'console' },
  //     miWarnFile: { type: 'file', filename: 'warn.log' },
  //     miErrorFile: { type: 'file', filename: 'error.log' },
  //   },
  //   categories: {
  //     default: { appenders: ['miLoggerConsole'], level: 'all' },
  //     loginfo: { appenders: ['miLoggerConsole'], level: 'info' },
  //     logwn: { appenders: ['miWarnFile', 'miLoggerConsole'], level: 'warn' },
  //     logerr: { appenders: ['miErrorFile', 'miLoggerConsole'], level: 'error' },
  //   },
  // })

  // const logWarning = log4js.getLogger('logwn')
  // const logError = log4js.getLogger('logerr')
  // const logInfo = log4js.getLogger('loginfo')

  // const transporter = createTransport({
  //   service: 'gmail',
  //   port: 587,
  //   auth: {
  //     user: '',
  //     pass: ''
  //   }
  // })

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

  app.set('view engine', 'ejs')

  app.use('/', routerPrinc)

  app.use((req, res) => {
    // logWarning.warn(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
    res.send(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
  })

  const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
  })
  connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

  const {EliminarProducto, RederCarro, AddCar, BuyCar} = require('./Daos/socketDao')

  io.on('connection', socket => {
    socket.on('BuyCar', (user) => {
      BuyCar(user)
    })

    socket.on('rendercarro', (user) => {
      RederCarro(user, socket)
    })

    socket.on('deleteProduct', (data) => {
      EliminarProducto(data, socket)
    })

    socket.on('AddCarro', (objeto) => {
      AddCar(objeto, socket)
    })
  })
}