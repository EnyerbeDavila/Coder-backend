const { findPoductos, findPoductosBy} = require('../Persistencia/Pesistencia')


module.exports = {
    getProductos: async (req, res) => {
        let productos = await findPoductos()
        res.send(productos)
    },
    getProductosByCategoria: async (req, res) => {
        let productos = await findPoductosBy({ categoria: req.params.categoria })
        if (productos == null) {
            res.send('No se encontraron productos con esta categoria')
        } else {
            res.send(productos)
        }
    },
    getProductosById: async (req, res) => {
        try {
            let producto = await findPoductosBy({ _id: req.params.id })
            if (producto == null) {
                res.send('Producto no encontrado')
            } else {
                res.send(producto)
            }
        } catch (e) {
            res.send('No se ha encontrado el Producto')
        }

    }
}