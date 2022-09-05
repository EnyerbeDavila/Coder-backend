const express = require('express')
const router = new express.Router()
const { getProductos, getProductosByCategoria, getProductosById } = require('../../daos/ProductosDao')

router.get('/', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getProductos)

router.get('/id/:id', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getProductosById)

router.get('/categoria/:categoria', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getProductosByCategoria)

module.exports = router