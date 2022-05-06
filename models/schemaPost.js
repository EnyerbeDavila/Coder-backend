const mongoose = require("mongoose")

const schemaPost = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed }, {strict: false})

module.exports = mongoose.model("post", schemaPost)