const express = require('express')
const router = new express.Router()

const routerFuncVarias = require('./routers/routerVarios')
const routerUser = require('./routers/routerUser')

router.use('/', routerUser)
router.use('/varios', routerFuncVarias)

module.exports = router