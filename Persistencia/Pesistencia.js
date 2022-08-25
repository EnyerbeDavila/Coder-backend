const mongoose = require("mongoose")
const modelUser = require('../models/schemaUser')
const modelProducts = require('../models/schemaProducts')
const modelOrdenes = require('../models/schemaOrdenes')
const modelChat = require('../models/schemaChat')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Env = require('../env')

async function CRUD() {
    try {
        let rta = await mongoose.connect(`mongodb+srv://${Env.UserDB_2}:${Env.passwordDB_2}@cluster0.qku2u.mongodb.net/mydata?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log(e)
    }
}
CRUD()

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
    let usuario = req.body
    if (usuario.password2 == password) {
        let usuarioscont = modelUser.find({ username: username }, function (err, docs) {
            if (docs.length == 0) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        (async function () {
                            await new modelUser({ username: username, password: hash, nombre: usuario.nombre, NuTelefonico: usuario.NuTelefonico, direccion: usuario.direccion, carrito: [], admin: false }).save()
                            return done(null, { username: username })
                        }())
                    })
                })
            } else {
                return done(null, false)
            }
        })
    } else {
        return done(null, false)
    }
}))

passport.serializeUser((usuario, done) => {
    done(null, usuario.username)
})

passport.deserializeUser((username, done) => {
    let usuario = modelUser.find({ username: username }, function (err, docs) {
        const user = { username: docs[0].username, password: docs[0].password }
        done(null, user)
    })
})

function User(objeto) {
    let Usuario = { nombre: objeto[0].nombre, username: objeto[0].username, NuTelefonico: objeto[0].NuTelefonico, direccion: objeto[0].direccion, carrito: objeto[0].carrito, admin: objeto[0].admin }
    return Usuario
}


module.exports = {
    findById: async (user) => {
        let usuario = await modelUser.find({ username: user })
        let ObjUser = User(usuario)
        return ObjUser
    },
    updateCarrito: async (user, carro) => {
        let Productos = await modelUser.updateOne({ username: user }, {
            $set: { carrito: carro }
        })
    },
    findPoductos: async () => {
        let Productos = await modelProducts.find()
        return Productos
    },
    findPoductosBy: async (objeto) => {
        let Productos = await modelProducts.find(objeto)
        if (Productos.length == 0) {
            return null
        } else {
            return Productos
        }
    },
    saveOrden: async (objeto) => {
        let ordenes = await modelOrdenes.find()
        let numero = ordenes.length + 1
        let orden = {email: objeto.username, estado: 'generada', fechayHora: new Date().toLocaleString(), numero: numero, direccion: objeto.direccion, carrito_Compra: objeto.carrito }
        await new modelOrdenes(orden).save()
        return orden
    },
    findOrdenes: async () => {
        let ordenes = await modelOrdenes.find()
        return ordenes
    },
    findOrdenesByUser: async (user) => {
        let ordenes = await modelOrdenes.find({ email: user})
        return ordenes
    },
    findChatMessages: async () => {
        let chat = await modelChat.find()
        return chat
    },
    findChatByUser: async (user) => {
        let messages = modelChat.find({email: user})
        return messages
    },
    saveMessage: async (message) => {
        await new modelChat(message).save()
        let chat = await modelChat.find()
        return chat
    },
    passport
}