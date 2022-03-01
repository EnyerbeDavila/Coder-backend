const fs = require('fs')
const express = require('express')
const { json } = require('express/lib/response')

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

const file = fs.readFileSync(`./Contenedor.txt`, "utf-8");

function randomObject () {
    const Number = Math.floor(Math.random() * (4 - 1)) + 1
    const array = JSON.parse(file);
    const objeto = array.filter(obj => obj.id == Number);
    return JSON.stringify(objeto)
}

app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor')
})

 app.get('/productos', (req, res) => {
    res.send(`Los objetos disponibles son ${file}`)
})

 app.get('/productoRandom', (req, res) => {
    res.send(`El objeto asignado a esta entrada es ${randomObject()}`)
})
