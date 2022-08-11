const { findById } = require('../Persistencia/Pesistencia')

module.exports = {
    RenderFallo: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('login-error.ejs')
    },
    RenderFallo2: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('Regis-error.ejs')
    },
    login: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('formularioLog.ejs')
    },
    RenderRegis: (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
        res.render('formularioRegist.ejs')
    },
    RenderLogout: async (req, res) => {
        // logInfo.info(`Peticion en la ruta: ${req.path}, a traves del Metodo: ${req.method}`)
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
    RenderPrinc: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        res.render('index.ejs', { nombre: usuario.nombre, foto: usuario.urlAvatar })
    },
    RenderProducts: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        res.render('productos.ejs', { username: usuario.username, nombre: usuario.nombre, foto: usuario.urlAvatar })

    },
    RenderInfo: async (req, res) => {
        let user = req.user.username
        let usuario = await findById(user)
        res.render('info-usuario.ejs', { username: usuario.username, nombre: usuario.nombre, telefono: usuario.NuTelefonico, foto: usuario.urlAvatar, edad: usuario.edad, correo: usuario.username })
    }
}