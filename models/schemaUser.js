const mongoose = require("mongoose")

const schemaUser = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, {strict: false})

module.exports = mongoose.model("Usuarios", schemaUser)