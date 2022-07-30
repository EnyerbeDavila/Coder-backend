const mongoose = require("mongoose")
const modelUser = require('../models/schemaUser')

async function CRUD() {
    try {
        let rta = await mongoose.connect('mongodb+srv://user3:Asd.123@cluster0.qku2u.mongodb.net/mydata?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (e) {
        console.log(e)
    }
}
CRUD()

module.exports = {
    EliminarProducto: (data, socket) => {
        let usuario = modelUser.find({ username: data.user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                let carro = docs[0].carrito
                let indice = carro.indexOf(data.producto)
                carro.splice(indice, 1)
                async function Product() {
                    let Productos = await modelUser.updateOne({ username: data.user }, {
                        $set: { carrito: carro }
                    })
                }
                Product()
                socket.emit('renderCarro', { carrito: carro, user: data.user })
            }
        })
    },
    RederCarro: (user, socket) => {
        let usuario = modelUser.find({ username: user }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('renderCarro', { carrito: docs[0].carrito, user: user })
            }
        })
    },
    AddCar: (objeto, socket) => {
        let usuario = modelUser.find({ username: objeto.username }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                let carro = docs[0].carrito
                carro.push(objeto.producto)
                async function Product() {
                    let Productos = await modelUser.updateOne({ username: objeto.username }, {
                        $set: { carrito: carro }
                    })
                }
                Product()
                socket.emit('renderCarro', { carrito: carro, user: objeto.username })
            }
        })
    },
    BuyCar: (user) => {
        // let usuario = modelUser.find({ username: user }, function (err, docs) {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         try {
        //             const info = transporter.sendMail(
        //                 {
        //                     from: 'Coder-Backend',
        //                     to: '',
        //                     subject: `Nuevo pedido de ${docs[0].nombre} - ${user}`,
        //                     html: `El usuario ${docs[0].nombre} de correo ${user} solicito: ${docs[0].carrito}`
        //                 }
        //             )
        //         } catch (error) {
        //             console.log(err)
        //         }
        //         try {
        //             const message = client.messages.create({
        //                 body: `Nuevo pedido del usuario ${docs[0].nombre} de correo ${user} solicito:  ${docs[0].carrito}`,
        //                 from: '',
        //                 to: ''
        //             }).done();
        //         } catch (error) {
        //             console.log(error)
        //         }
        //         try {
        //             const message = client.messages.create({
        //                 body: `Su pedido fue recibido y esta en proceso`,
        //                 from: '',
        //                 to: ''
        //             }).done();
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     }
        // })
    }
}