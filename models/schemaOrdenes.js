const mongoose = require("mongoose")

const schemaOrdenes = new mongoose.Schema({
    email: { type: String, required: true },
    estado: { type: String, required: true },
    fechayHora: { type: String, required: true },
    numero: { type: Number, required: true },
    direccion: { type: String, required: true },
    carrito_Compra: { type: Array, required: true },
})

module.exports = mongoose.model("Ordenes", schemaOrdenes)