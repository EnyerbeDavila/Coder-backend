const { findById, UpdateCar } = require('../Persistencia/Pesistencia')

module.exports = {
    EliminarProducto: async (data, socket) => {
        let usuario = await findById(data.user)
        let carro = usuario.carrito
        let indice = carro.indexOf(data.producto)
        carro.splice(indice, 1)
        await UpdateCar(data.user, carro)
        socket.emit('renderCarro', { carrito: carro, user: data.user })
    },
    RederCarro: async (user, socket) => {
        let usuario = await findById(user)
        socket.emit('renderCarro', { carrito: usuario.carrito, user: user })
    },
    AddCar: async (objeto, socket) => {
        let usuario = await findById(objeto.username)
        let carro = usuario.carrito
        carro.push(objeto.producto)
        await UpdateCar(objeto.username, carro)
        socket.emit('renderCarro', { carrito: carro, user: objeto.username })
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