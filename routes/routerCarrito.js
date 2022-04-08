const express = require("express")
const fs = require("fs")

const routerCarrito = express.Router()
routerCarrito.use(express.urlencoded({ extended: true }))
routerCarrito.use(express.json())

let numberCarrito = 0
function generateNumberCarrito() {
    return ++numberCarrito
}

routerCarrito.post("/", (req, res) => {
    fs.writeFile(`./public/Persistencia/carrito${generateNumberCarrito()}.txt`, "[]", (err) => {
        if (err) {
            res.send("error al crear el carrito")
        } else {
            res.send(`se ha creado un carrito el id que le fue asignado es: ${numberCarrito}`)
        }
    })
})

routerCarrito.delete("/:id", (req, res) => {
    fs.unlink(`./public/Persistencia/carrito${req.params.id}.txt`, (err) => {
        if (err) {
            res.send("error al eliminar el carrito")
        } else {
            res.send("Carrito eliminado con exito")
        }
    })
})

routerCarrito.get("/:id/productos", (req, res) => {
    try {
        const carrito = JSON.parse(fs.readFileSync(`./public/Persistencia/carrito${req.params.id}.txt`, "utf-8"))
        if (carrito.length == 0) {
            res.send("carrito vacio")
        } else {
            res.send(JSON.stringify(carrito))
        }
    } catch (err) {
        res.send("no se encontro el carrito")
    }
})

routerCarrito.post("/:id/productos/:id_prod", (req, res) => {
    const productos = JSON.parse(fs.readFileSync("./public/Persistencia/productos.txt", "utf-8"))
    const carrito = JSON.parse(fs.readFileSync(`./public/Persistencia/carrito${req.params.id}.txt`, "utf-8"))
    const producto = productos.filter(obj => obj.id == req.params.id_prod);
    let product = producto[0]
    carrito.push(product)
    fs.writeFile(`./public/Persistencia/carrito${req.params.id}.txt`, JSON.stringify(carrito), (err) => {
        if (err) {
            res.send("error al agragar el producto al carrito")
        } else {
            res.send("producto agregado con exito")
        }
    })
})

routerCarrito.delete("/:id/productos/:id_prod", (req, res) => {
    const carrito = JSON.parse(fs.readFileSync(`./public/Persistencia/carrito${req.params.id}.txt`, "utf-8"))
    const carrito2 = carrito.filter(obj => obj.id != req.params.id_prod)
    fs.writeFile(`./public/Persistencia/carrito${req.params.id}.txt`, JSON.stringify(carrito2), (err) => {
        if (err) {
            res.send("hubo un error al borrar el archivo")
        } else {
            res.send("producto eliminado con exito")
        }
    })
})

module.exports = routerCarrito