const mongoose = require("mongoose")

const schemaProductos = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, {strict: false})

module.exports = mongoose.model("Productos", schemaProductos)