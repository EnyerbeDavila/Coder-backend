const express = require("express")
const moment = require("moment")
const fs = require("fs")
const routerProductos = express.Router()

routerProductos.use(express.urlencoded({ extended: true }))
routerProductos.use(express.json())

let id = 0
function generateId() {
    return ++id
}

routerProductos.get("/", (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    if (productos == "") {
        res.send("no se encontraron productos")
    } else {
        res.send(JSON.stringify(productos))
    }
})

routerProductos.get("/:id", (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    const producto = productos.filter(obj => obj.id == req.params.id);
    if (producto.length == 0) {
        res.send("no se encontro el producto")
    } else {
        res.send(producto)
    }
})

routerProductos.post("/", (req, res, next) => {
    if (req.query.admin == 1) {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    const objeto = req.body
    objeto.id = generateId()
    objeto.timestamp = moment().format('(DD/MM/YYYY-hh:mm:ssa)')
    objeto.codigo = Date.now()
    productos.push(objeto)
    fs.writeFile("./public/Persistencia/productos.txt", JSON.stringify(productos), (err) => {
        if (err) {
            res.send("error al agregar el producto")
        } else {
            res.send("producto agregado con exito")
        }
    })
})

routerProductos.put("/:id", (req, res, next) => {
    if (req.query.admin == 1) {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    productos.map((data) => {
        if (data.id == req.params.id) {
            data.nombre = req.body.nombre
            data.descripcion = req.body.descripcion
            data.precio = req.body.precio
            data.urlfoto = req.body.urlfoto
            data.stock = req.body.stock
            data.timestamp = moment().format('(DD/MM/YYYY-hh:mm:ssa)')
            data.codigo = Date.now()
        }
    })
    fs.writeFile("./public/Persistencia/productos.txt", JSON.stringify(productos), (err) => {
        if (err) {
            res.send("error al reemplazar el producto")
        } else {
            res.send("producto reemplazado con exito")
        }
    })
})

routerProductos.delete("/:id", (req, res, next) => {
    if (req.query.admin == 1) {
        next()
    } else {
        res.send({ error: 'usted no tiene acceso' })
    }
}, (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    const product = productos.filter(obj => obj.id != req.params.id)
    fs.writeFile("./public/Persistencia/productos.txt", JSON.stringify(product), (err) => {
        if (err) {
            res.send("error al eliminar el objeto")
        } else {
            res.send("poducto eliminado con exito")
        }
    })
})

module.exports = routerProductos