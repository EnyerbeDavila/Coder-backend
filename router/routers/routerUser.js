const express = require('express')
const router = new express.Router()
const { RenderFallo, RenderFallo2, RenderLogout, RenderPrinc, RenderRegis, login, RenderProducts, RenderInfo} = require('../../Daos/userDao')
const { passport } = require('../../Persistencia/Pesistencia')

router.use(passport.initialize())
router.use(passport.session())


router.get('/Fallo', RenderFallo)

router.get('/Fallo2', RenderFallo2)

router.get('/login', (req, res, next) => {
    if (req.user == undefined) {
        next()
    } else {
        res.redirect('/')
    }
}, login)

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

router.get('/registro', (req, res, next) => {
    if (req.user == undefined) {
        next()
    } else {
        res.redirect('/')
    }
}, RenderRegis)

router.post('/registro',
    // (req, res, next) => {
    //     logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    //     next()
    // },
    passport.authenticate('registro',
        {
            successRedirect: '/login',
            failureRedirect: '/Fallo2'
        })
)

router.post('/log-out', RenderLogout)

router.get('/informacion-perso', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/login')
    } else {
        next()
    }
}, RenderInfo)

router.get('/products-user', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/login')
    } else {
        next()
    }
}, RenderProducts)

router.get('/', (req, res, next) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    if (req.user == undefined) {
        res.redirect('/login')
    } else {
        next()
    }
}, RenderPrinc)

module.exports = router