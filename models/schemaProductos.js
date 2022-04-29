const mongoose = require("mongoose")

const schemaProductos = new mongoose.Schema({
    nombre: {type: String, require: true},
    descripcion:{type: String, require: true},
    precio: {type: Number, require: true},
    urlfoto:{type: String, require: true},
    stock:{type: Number, require: true},
    id:{type: Number, require: true},
    timestamp:{type: String},
    codigo:{type: Number}
})

module.exports = mongoose.model("productos", schemaProductos)