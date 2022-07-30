module.exports = {
    RenderFallo: (res) => {
        res.render('login-error.ejs')
    },
    RenderFallo2: (res) => {
        res.render('Regis-error.ejs')
    },
    login: (req, res) => {
        req.logOut()
        res.render('formularioLog.ejs')
    },
    RenderRegis: (res) => {
        res.render('formularioRegist.ejs')
    },
    RenderLogout: (req, res, nombre) => {
        res.render('Bye.ejs', { user: nombre })
    },
    RenderPrinc: (res, docs) => {
        res.render('index.ejs', { nombre: docs[0].nombre, foto: docs[0].urlAvatar })
    },
    RenderProducts: (res, docs) => {
        res.render('productos.ejs', { username: docs[0].username, nombre: docs[0].nombre, foto: docs[0].urlAvatar })
    },
    RenderInfo: (res, docs) => {
        res.render('info-usuario.ejs', { username: docs[0].username, nombre: docs[0].nombre, telefono: docs[0].NuTelefonico, foto: docs[0].urlAvatar, edad: docs[0].edad, correo: docs[0].username })
    }
}