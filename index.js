const express = require('express')
const app = express()
const PORT = 8080
const mongoose = require("mongoose")
const admin = require("firebase-admin");
const serviceAccount = require("./bd/coder-backend-6388e-firebase-adminsdk-ccrjk-9ed57d316f.json");

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://coder-backend-6388e-default-rtdb.firebaseio.com"
    });
    console.log("Base de Datos firebase conectada")
} catch (e) {
    console.log(e)
}

async function CRUD() {
    try {
        const URL = "mongodb://127.0.0.1:27017/ecommerce"
        let rta = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Base de Datos mongodb conectada")
    } catch (e) {
        console.log(e)
    }
}
CRUD()

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