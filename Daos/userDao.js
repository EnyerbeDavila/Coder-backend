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

module.exports = {
    RenderFallo: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('login-error.ejs')
    },
    RenderFallo2: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('Regis-error.ejs')
    },
    login: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('formularioLog.ejs')
    },
    RenderRegis: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('formularioRegist.ejs')
    },
    RenderLogout: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        let user = req.user.username
        let usuario = modelUser.find({ username: user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                let nombre = docs[0].nombre
                req.logOut((err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                res.render('Bye.ejs', { user: nombre })
            }
        })
    },
    RenderPrinc: (req, res) => {
        let user = req.user.username
        let usuario = modelUser.find({ username: user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                res.render('index.ejs', { nombre: docs[0].nombre, foto: docs[0].urlAvatar })
            }
        })
    },
    RenderProducts: (req, res) => {
        let user = req.user.username
        let usuario = modelUser.find({ username: user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                res.render('productos.ejs', { username: docs[0].username, nombre: docs[0].nombre, foto: docs[0].urlAvatar })
            }
        })
    },
    RenderInfo: (req, res) => {
        let user = req.user.username
        let usuario = modelUser.find({ username: user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                res.render('info-usuario.ejs', { username: docs[0].username, nombre: docs[0].nombre, telefono: docs[0].NuTelefonico, foto: docs[0].urlAvatar, edad: docs[0].edad, correo: docs[0].username })
            }
        })
    },
    passport
}