const { faker } = require('@faker-js/faker')
faker.locale = 'es'

const optionsMini = { default: { puerto: '8080', modo: 'FORK' } }
const parseArgs = require('minimist')
const args = parseArgs(process.argv, optionsMini)

const os = require('os')

module.exports = {
    SendInfo: (res) => {
        let objeto = {
            ArgumentosDeEntrada: args,
            PuertoDeEscucha: process.env.PORT,
            SistemaOperativo: os.type(),
            VersionNodejs: process.version,
            Rss: process.memoryUsage.rss(),
            PathEjecucion: process.execPath,
            PathEjecutable: args._[1],
            processId: process.pid,
            NumerosDeNucleos: os.cpus().length
        }
        res.send(objeto)
    },
    NumberRandoms: (req, res) => {
        let cant = 0
        let numeros = []
        let objNumeros = []
        if (req.query.cant == undefined) {
            cant = 100000000
        } else {
            cant = req.query.cant
        } for (let i = 0; i < cant; i++) {
            let numero = Math.floor(Math.random() * (1000 - 1) + 1)
            numeros.push(numero)
        }
        let contador = 0
        let indice
        for (let i = 1; i < 1000;) {
            indice = numeros.indexOf(i)
            if (indice != -1) {
                contador++
                numeros.splice(indice, 1)
            } else {
                registrar(i, contador)
                i++
                contador = 0
            }
        }
        function registrar(numero, veces) {
            let obj = `{${numero} : ${veces}}`
            objNumeros.push(obj)
        }
        res.send(objNumeros)
    },
    ProductosTest: (res) => {
        let productos = []
        for (let i = 0; i < 5; i++) {
            let producto = {}
            producto.Nombre = faker.commerce.product()
            producto.Precio = faker.commerce.price()
            producto.UrlFoto = faker.image.imageUrl()
            productos.push(producto)
        }
        res.send(JSON.stringify(productos))
    }
}