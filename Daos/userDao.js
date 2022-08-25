const { findById, findOrdenes, findOrdenesByUser, findChatByUser } = require('../Persistencia/Pesistencia')

module.exports = {
    RenderFallo: (req, res) => {
        res.render('login-error.ejs')
    },
    RenderFallo2: (req, res) => {
        res.render('Regis-error.ejs')
    },
    login: (req, res) => {
        res.render('formularioLog.ejs')
    },
    RenderRegis: (req, res) => {
        res.render('formularioRegist.ejs')
    },
    RenderLogout: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        req.logOut((err) => {
            if (err) {
                console.log(err)
            } else {
                res.render('Bye.ejs', { user: usuario.nombre })
            }
        })
    },
    renderChat: async (req, res) => {
        let user = req.user.username
        res.render('chat.ejs', {user: user})
    }, 
    getMessages: async (req, res) => {
        let user = req.user.username
        let messages = await findChatByUser(user)
        res.send(messages)
    },
    renderChatAdmin: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        if (usuario.admin == true) {
            res.render('chatAdmin.ejs')
        } else {
            res.send('Usted no tinene los Permisos necesarios')
        }
    },
    getOrdenes: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        if (usuario.admin == true) {
            let ordenes = await findOrdenes()
            res.send(ordenes)
        } else {
            res.send('Usted no tinene los Permisos necesarios')
        }
    },
    getOrden: async (req, res) => {
        let user = req.user.username
        let ordenes = await findOrdenesByUser(user)
        res.send(ordenes)
    }
}