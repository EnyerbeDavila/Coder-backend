const mongoose = require("mongoose")
const modelUser = require('../models/schemaUser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

async function CRUD() {
    try {
        let rta = await mongoose.connect('mongodb+srv://user3:Asd.123@cluster0.qku2u.mongodb.net/mydata?retryWrites=true&w=majority', {
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
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            let usuarioscont = modelUser.find({ username: username }, function (err, docs) {
                if (docs.length == 0) {
                    async function send() {
                        let usuario = req.body
                        // try {
                        //     const info = await transporter.sendMail(
                        //         {
                        //             from: 'Coder-Backend',
                        //             to: '',
                        //             subject: 'Nuevo registro',
                        //             html: `Nuevo Registro: nombre: ${usuario.nombre}, email: ${username}, edad: ${usuario.edad}, numero telefonico: ${usuario.NuTelefonico}`
                        //         }
                        //     )
                        // } catch (error) {
                        //     console.log(err)
                        // }
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

function User (objeto) {
    let Usuario = {nombre: objeto[0].nombre, username: objeto[0].username, NuTelefonico: objeto[0].NuTelefonico, urlAvatar: objeto[0].urlAvatar, edad: objeto[0].edad, carrito: objeto[0].carrito}
    return Usuario
}


module.exports = {
    findById: async (user) => {
        let usuario = await modelUser.find({ username: user })
        let ObjUser = User(usuario)
        return ObjUser
    },
    UpdateCar: async (user, carro) => {
        let Productos = await modelUser.updateOne({ username: user }, {
            $set: { carrito: carro }})
    }, passport
}


