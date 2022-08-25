const express = require('express')
const router = new express.Router()

const routerCarrito = require('./routers/routerCarrito')
const routerUser = require('./routers/routerUser')
const routerProductos = require('./routers/routerProductos')

router.use('/', routerUser)
router.use('/Productos', routerProductos)
router.use('/Carrito', routerCarrito)

module.exports = router