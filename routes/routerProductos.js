const express = require("express")
const { gettingById, getting, postProducto, reemplazar, eliminar} = require("../DAOS/productosdao")
const routerProductos = express.Router()

routerProductos.use(express.urlencoded({ extended: true }))
routerProductos.use(express.json())

routerProductos.get("/", (req, res) => {
    getting(req, res)
})

routerProductos.get("/:id", (req, res) => {
    gettingById(req, res)
})

routerProductos.post("/", (req, res, next) => {
    if (req.query.admin == "true") {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    postProducto(req, res)
})

routerProductos.put("/:id", (req, res, next) => {
    if (req.query.admin == "true") {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    reemplazar(req, res)
})

routerProductos.delete("/:id", (req, res, next) => {
    if (req.query.admin == "true") {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    eliminar(req, res)
})

module.exports = routerProductos