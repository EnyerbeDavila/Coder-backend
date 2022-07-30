const express = require('express')
const router = new express.Router()
const { SendInfo, NumberRandoms, ProductosTest} = require('../../Daos/variosDao')
const compression = require('compression')

router.get('/info', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
})

router.get('/infozip', compression(), (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    SendInfo(res)
})

router.get('/api/randoms', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    NumberRandoms(req, res)
})

router.get('/api/productos-test', (req, res) => {
    // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
    ProductosTest(res)
})

module.exports = router