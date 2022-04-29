const express = require("express")
const { addCarrito, deleteCarrito, getCarrito, postProducto, deleteProducto } = require("../DAOS/carritodao")
const routerCarrito = express.Router()
routerCarrito.use(express.urlencoded({ extended: true }))
routerCarrito.use(express.json())

routerCarrito.post("/", (req, res) => {
    addCarrito(req, res)
})

routerCarrito.delete("/:id", (req, res) => {
    deleteCarrito(req, res)
})

routerCarrito.get("/:id/productos", (req, res) => {
    getCarrito(req, res)
})

routerCarrito.post("/:id/productos/:id_prod", (req, res) => {
    postProducto(req, res)
})

routerCarrito.delete("/:id/productos/:id_prodCar", (req, res) => {
    deleteProducto(req, res)
})

module.exports = routerCarrito