const mongoose = require("mongoose")

const schemaUser = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    NuTelefonico: { type: String, required: true },
    direccion: { type: String, required: true },
    carrito: { type: Array, required: true },
    admin: { type: Boolean, required: true },
})

module.exports = mongoose.model("Usuarios", schemaUser)