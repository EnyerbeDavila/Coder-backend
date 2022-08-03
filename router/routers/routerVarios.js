const express = require('express')
const router = new express.Router()
const { SendInfo, NumberRandoms, ProductosTest} = require('../../Daos/variosDao')
const compression = require('compression')

router.get('/info', SendInfo)

router.get('/infozip', compression(), SendInfo)

router.get('/api/randoms', NumberRandoms)

router.get('/api/productos-test', ProductosTest)

module.exports = router