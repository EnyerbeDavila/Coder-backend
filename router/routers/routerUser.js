const express = require('express')
const router = new express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {RenderFallo, RenderFallo2, RenderLogout, RenderPrinc, RenderRegis, login, RenderProducts, RenderInfo} = require('../../Daos/userDao')
const mongoose = require("mongoose")
const modelUser = require('../../models/schemaUser')
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

router.use(passport.initialize())
router.use(passport.session())

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

router.get('/Fallo', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo(res)
})

router.get('/Fallo2', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderFallo2(res)
})

router.get('/login', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    login(req, res)
})

router.post('/login',
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

router.get('/registro', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    RenderRegis(res)
})

router.post('/registro', (req, res, next) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    next()
}, passport.authenticate('registro',
    {
        successRedirect: '/login',
        failureRedirect: '/Fallo2'
    })
)

router.post('/log-out', (req, res) => {
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

router.get('/informacion-perso', (req, res, next) => {
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
            RenderInfo(res, docs)
        }
    })
})

router.get('/products-user', (req, res, next) => {
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
            RenderProducts(res, docs)
        }
    })
})

router.get('/', (req, res, next) => {
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
            RenderPrinc(res, docs)
        }
    })
})

module.exports = router