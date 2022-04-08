const fs = require("fs")
const express = require('express')
const moment = require("moment")
const app = express()
const PORT = 8080

const ProductosRouter = require("./routes/routerProductos")
const CarritoRouter = require("./routes/routerCarrito")

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const server = app.listen(PORT, () => {
    console.log('servidor levantado en el puerto ' + server.address().port)
})

app.use("/api/productos", ProductosRouter)
app.use("/api/carrito", CarritoRouter)









fs.writeFile