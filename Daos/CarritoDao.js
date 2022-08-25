const { findById, updateCarrito, findPoductosBy, saveOrden } = require('../Persistencia/Pesistencia')
const { createTransport } = require('nodemailer')
const Env = require('../env')

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${Env.MyEmail}`,
        pass: `${Env.password_nodemailer}`
    }
})

module.exports = {
    getCarrito: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        res.send(usuario.carrito)
    },
    deleteProdCarrito: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        let carrito = usuario.carrito
        let producto = carrito.find(obj => obj._id == req.params.id)
        let indice = carrito.indexOf(producto)
        if (indice == -1) {
            res.send('Producto no encontrado en el Carro')
        } else {
            carrito.splice(indice, 1)
            let newcar = await updateCarrito(user, carrito)
            res.send(carrito)
        }
    },
    addProdCarrito: async (req, res) => {
        let user = req.user.username
        try {
            let ProductoDB = await findPoductosBy({ _id: req.params.id })
            if (ProductoDB == null) {
                res.send('Producto no encontrado')
            } else {
                let usuario = await findById(user)
                let carrito = usuario.carrito
                let producto = carrito.find(obj => obj._id == req.params.id)
                if (producto == undefined) {
                    carrito.push(ProductoDB[0])
                    let newcar = await updateCarrito(user, carrito)
                    res.send(carrito)
                } else {
                    if (producto.cant == undefined) {
                        producto.cant = 2
                    } else {
                        producto.cant = producto.cant + 1
                    }
                    let indice = carrito.indexOf(producto)
                    carrito[indice] = producto
                    let newcar = await updateCarrito(user, carrito)
                    res.send(carrito)
                }
            }
        } catch (e) {
            console.log(e)
            res.send('No se ha encontrado el Producto')
        }
    },
    compraCarrito: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        let orden = await saveOrden(usuario)
        try {
            const info = transporter.sendMail(
                {
                    from: 'Coder-Backend',
                    to: `${Env.EmailDestino}`,
                    subject: `Nueva Orden`,
                    html: `El usuario ${orden.email} a las ${orden.fechayHora} realizo el pedido #${orden.numero} en la cual solicito: ${JSON.stringify(orden.carrito_Compra)} || Para ser entregado en ${orden.direccion}`
                }
            )
        } catch (error) {
            console.log(err)
        }
        res.send('Pedido Realizado')
    }
}