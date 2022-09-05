const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const connectMongo = require('connect-mongo')
const session = require('express-session')
const parseArgs = require('minimist')
const Env = require('./env')
const routerPrinc = require('./router/routerPrinc')
const { addMessage, RenderChat, RenderChatAdm } = require('./Daos/socketdao')

const optionsMini = { default: { puerto: '8080' } }
const args = parseArgs(process.argv, optionsMini)
const PORT = process.env.PORT || args.puerto

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    session({
        store: connectMongo.create({
            mongoUrl: `mongodb+srv://${Env.UserDB}:${Env.passwordDB}@cluster0.qku2u.mongodb.net/sessions?retryWrites=true&w=majority`,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: Env.time_sessions
        }),
        secret: 'secreto',
        resave: true,
        saveUnitialized: true,
    })
)

app.set('view engine', 'ejs')

app.use('/', routerPrinc)

app.use((req, res) => {
    res.send(`Ruta Inexistente: ${req.path}, Metodo: ${req.method}`)
})

const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

io.on('connection', socket => {

    RenderChat(socket)

    RenderChatAdm(socket)

    socket.on('new-message', (message) => {
        addMessage(message, socket)
    })
})