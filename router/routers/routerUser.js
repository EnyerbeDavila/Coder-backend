const express = require('express')
const router = new express.Router()
const { RenderFallo, RenderFallo2, RenderLogout, RenderRegis, login, getOrdenes, getOrden, renderChat, renderChatAdmin, getMessages } = require('../../daos/UserDao')
const { passport } = require('../../Persistencia/Pesistencia')

router.use(passport.initialize())
router.use(passport.session())

router.get('/', (req, res, next) => {
    if (req.user == undefined) {
        next()
    } else {
        res.redirect('/Productos')
    }
}, login)

router.post('/',
    passport.authenticate('login',
        {
            successRedirect: '/Productos',
            failureRedirect: '/Fallo'
        })
)

router.get('/Fallo', RenderFallo)

router.get('/registro', (req, res, next) => {
    if (req.user == undefined) {
        next()
    } else {
        res.redirect('/Productos')
    }
}, RenderRegis)

router.post('/registro',
    passport.authenticate('registro',
        {
            successRedirect: '/',
            failureRedirect: '/Fallo2'
        })
)

router.get('/Fallo2', RenderFallo2)

router.get('/log-out', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, RenderLogout)

router.get('/chat', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, renderChat)

router.get('/chat/mysms', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getMessages)

router.get('/chat/response', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, renderChatAdmin)

router.get('/orden', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getOrden)

router.get('/ordenes', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getOrdenes)

module.exports = router