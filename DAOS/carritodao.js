const mongoose = require("mongoose")
const modelProductos = require("../models/schemaProductos");
const admin = require("firebase-admin");
const db = admin.firestore()
const query = db.collection("carritos")

let id = 0
function generateId() {
    return ++id
}

let numberCarrito = 0
function generateNumberCarrito() {
    return ++numberCarrito
}

module.exports = {
    addCarrito: async function (req, res) {
        try {
            const doc = query.doc(`Carrito-${generateNumberCarrito()}`)
            await doc.create({ productos: [] })
            res.send(`se ha creado un carrito el id que le fue asignado es: ${numberCarrito}`)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },

    deleteCarrito: async function (req, res) {
        try {
            const doc = query.doc(`Carrito-${req.params.id}`)
            await doc.delete()
            res.send("Carrito eliminado con exito")
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },

    getCarrito: async function (req, res) {
        try {
            const doc = query.doc(`Carrito-${req.params.id}`)
            const carrito = await doc.get("productos")
            const productos = carrito.data()
            if (productos == null) {
                res.send("No existe el carrito")
            } else if (productos.productos.length == 0) {
                res.send("carrito vacio")
            }
            else {
                res.send(productos)
            }
        } catch (err) {
            console.log(err)
            res.send("Ha ocurrido un error")
        }
    },

    postProducto: async function (req, res) {
        try {
            let producto = await modelProductos.find({ id: `${req.params.id_prod}` })
            const doc = query.doc(`Carrito-${req.params.id}`)
            let productostring = JSON.stringify(producto[0])
            let productoparse = JSON.parse(productostring)
            productoparse.idCar = generateId()
            await doc.update({
                productos: admin.firestore.FieldValue.arrayUnion(productoparse)
            })
            res.send(`Producto agregado con exito, el id que le fue asignado en el carro es: ${productoparse.idCar}`)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },

    deleteProducto: async function (req, res) {
        try {
            const doc = query.doc(`Carrito-${req.params.id}`)
            let products = await doc.get()
            let products2 = products.data()
            let product = await products2.productos.filter(obj => obj.idCar == req.params.id_prodCar)
            await doc.update({
                productos: admin.firestore.FieldValue.arrayRemove(product[0])
            });
            res.send(`Producto eliminado con exito`)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    }
}



