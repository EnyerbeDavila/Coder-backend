const socket = io.connect();

function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
              <strong style="color: aqua;">${elem.email}</strong>
              <em style="color: burlywood;">${elem.fecha}:</em>
              <em  style="color: greenyellow;"><i>${elem.mensaje}</i></em> </div>`
    })
    .join(' ')
  document.getElementById('mensajes').innerHTML = html
}

function rendertabla(data) {
  const tablaheader = `<tr  style="color: rgb(0, 255, 98);"> <th>Nombre</th> <th>Precio</th> <th>Imagen</th> </tr>`
  const html = data
    .map((elem, index) => {
      return `<tr>
      <td> ${elem.nombre}</td>
      <td> ${elem.precio} </td>
      <td> <img src="${elem.urlfoto}" alt=""> </td>
      </tr>`
    })
    .join("")
  document.getElementById('tabla').innerHTML = tablaheader + html
}

function addMessage(e) {
  const mensaje = {
    email: document.getElementById('email').value,
    mensaje: document.getElementById('texto').value,
  }
  socket.emit('new-message', mensaje)
  return false
}

function addProduct() {
  const producto = {
    nombre: document.getElementById('nombre').value,
    precio: document.getElementById('precio').value,
    urlfoto: document.getElementById('urlfoto').value,
  }
  socket.emit('new-product', producto)
  return false
}

socket.on('messages', (data) => {
  render(data)
})

socket.on('product', (data) => {
  rendertabla(data)
})

