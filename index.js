const express = require('express')
const app = express()
const PORT = 8080

app.use(express.static('public'))

const server = app.listen(PORT, () => {
  console.log('servidor levantado en el puerto: ' + server.address().port)
})

server.on('error', (error) => console.log(`hubo un error ${error}`))

const productos = []

const routerproductos = express.Router()



routerproductos.use(express.urlencoded({ extended: true }))

routerproductos.use(express.json())

let id = 0
function generateId () {
  return id++
}

routerproductos.get('/productos', (req, res) => {
  res.json(productos)
})

routerproductos.get('/productos/:id', (req, res) => {
  const producto = productos[req.params.id]
  if (isNaN(req.params.id)) {
    res.json({ error: 'el parametro no es un numero' })
  } else {
    producto !== undefined && producto !== null
      ? res.send(producto)
      : res.json({ error: 'producto no encontrado' })
  }
})

routerproductos.post('/productos', (req, res) => {
  const objeto = req.body
  objeto.id = generateId()
  console.log(objeto)
  productos.push(objeto)
  res.json({ mensaje: `el objeto se agrego correctamente, el id que le fue asignado es: ${objeto.id}` })
})

routerproductos.put('/productos/:id', (req, res) => {
  const objeto = req.body
  objeto.id = req.params.id
  productos[req.params.id] = objeto
  if (isNaN(req.params.id)) {
    res.json({ error: 'el parametro no es un numero' })
  } else {
    objeto !== undefined && objeto !== null
      ? res.send(objeto)
      : res.json({ error: 'producto no encontrado' })
  }
})

routerproductos.delete('/productos/:id', (req, res) => {
  productos[req.params.id] = null
  if (isNaN(req.params.id)) {
    res.json({ error: 'el parametro no es un numero' })
  } else {
    res.send("producto elimiado con exito")
  }
})

app.use('/api', routerproductos)
