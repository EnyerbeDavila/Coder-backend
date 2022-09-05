const express = require('express')
const router = new express.Router()
const { getCarrito, addProdCarrito, deleteProdCarrito, compraCarrito} = require('../../daos/CarritoDao')

router.get('/', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, getCarrito)

router.delete('/:id', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, deleteProdCarrito)

router.put('/:id', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, addProdCarrito)

router.get('/comprar', (req, res, next) => {
    if (req.user == undefined) {
        res.redirect('/')
    } else {
        next()
    }
}, compraCarrito)

module.exports = router