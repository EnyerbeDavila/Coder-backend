const express = require("express")
const { addCarrito, deleteCarrito, getCarrito, postProducto, deleteProducto } = require("../DAOS/carritodao")
const routerCarrito = express.Router()
routerCarrito.use(express.urlencoded({ extended: true }))
routerCarrito.use(express.json())

// solo se envia la solicitud y se crea el carrito
routerCarrito.post("/", (req, res) => {
    addCarrito(req, res)
})
// se envia el id del carrito y este lo elimina
routerCarrito.delete("/:id", (req, res) => {
    deleteCarrito(req, res)
})
// se envia el id del carrito y este devuelve los productos que hay en dicho carrito
routerCarrito.get("/:id/productos", (req, res) => {
    getCarrito(req, res)
})
// se envia el id del carrito y de un producto para añadir el producto al carrito
routerCarrito.post("/:id/productos/:id_prod", (req, res) => {
    postProducto(req, res)
})
// se envia el id del carrito y de un producto para eliminar el producto del carrito
routerCarrito.delete("/:id/productos/:id_prodCar", (req, res) => {
    deleteProducto(req, res)
})

module.exports = routerCarrito