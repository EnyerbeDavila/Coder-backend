const moment = require("moment")
const modelProductos = require("../models/schemaProductos")
const mongoose = require("mongoose")

let id = 0
function generateId() {
    return ++id
}

module.exports = {
    getting: async function (req, res) {
        try {
            let productos = await modelProductos.find()
            res.send(productos)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },
    gettingById: async function (req, res) {
        try {
            let producto = await modelProductos.find({ id: `${req.params.id}` })
            res.send(producto)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },
    postProducto: async function (req, res) {
        const objeto = req.body
        objeto.id = generateId()
        objeto.timestamp = moment().format('(DD/MM/YYYY-hh:mm:ssa)')
        objeto.codigo = Date.now()
        try {
            new modelProductos(objeto).save()
            res.send(`producto agregado con exito y su id es: ${objeto.id}`)
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },
    reemplazar: async function (req, res) {
        try {
            await modelProductos.updateOne({ id: `${req.params.id}` }, { $set: req.body })
            res.send("producto reemplazado con exito")
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    },
    eliminar: async function (req, res) {
        try {
            await modelProductos.deleteMany({ id: `${req.params.id}` })
            res.send("producto eliminado con exito")
        } catch (e) {
            console.log(e)
            res.send("Ha ocurrido un error")
        }
    }
}