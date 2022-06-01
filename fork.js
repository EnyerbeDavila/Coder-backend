process.on('message', (obj) => {
    let cant = 0
    let numeros = []
    let objNumeros = []
    if (obj.cant == undefined) {
        cant = 100000000
    } else {
        cant = obj.cant
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
    process.send(objNumeros)
})

