const mongoose = require("mongoose")

const schemaChat = new mongoose.Schema({
    email: { type: String, required: true },
    tipo: { type: String, required: true },
    fechayHora: { type: String, required: true },
    cuerpoMsg: { type: String, required: true },
})

module.exports = mongoose.model("chatMessages", schemaChat)