const express = require("express")
const { gettingById, getting, postProducto, reemplazar, eliminar} = require("../DAOS/productosdao")
const routerProductos = express.Router()

routerProductos.use(express.urlencoded({ extended: true }))
routerProductos.use(express.json())

// un get que devuelve todos los productos.
routerProductos.get("/", (req, res) => {
    getting(req, res)
})

// un get que devielve un producto por su id.
routerProductos.get("/:id", (req, res) => {
    gettingById(req, res)
})
// un post que require que le envies un objeto a travez del body con: nombre, descripcion, precio, urlfoto y stock.
routerProductos.post("/", (req, res, next) => {
    if (req.query.admin == "true") {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    postProducto(req, res)
})
// un put que require que le envies el id del objeto a actualizar y un objeto a traves del body con los parametros a actualizar; ejemplo: {stock: 20}.
routerProductos.put("/:id", (req, res, next) => {
    if (req.query.admin == "true") {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    reemplazar(req, res)
})
// permite borrar un objeto por su id.
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