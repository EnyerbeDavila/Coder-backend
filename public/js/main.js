const socket = io.connect();

const author = new normalizr.schema.Entity('author')
const comment = new normalizr.schema.Entity('comment')
const fecha = new normalizr.schema.Entity('fecha')
const organigrama = new normalizr.schema.Entity('organigrama', {
  author: author,
  text: comment,
  fecha: fecha
}, { idAttribute: 'id' })
const autores = new normalizr.schema.Array(organigrama)

function Procentaje(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
              <h2 class="text-center"> (Compresion del: ${data[0]}% ) </h2>
              </div>`
    })
    .join(' ')
  document.getElementById('procentaje').innerHTML = html
}

function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
              <strong style="color: aqua;">${elem[0]}</strong>
              <em style="color: burlywood;">${elem[2]}:</em>
              <em  style="color: greenyellow;"><i>${elem[1]}</i></em> </div>`
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
  const Post = {
    author: {
      id: document.getElementById('id').value,
      nombre: document.getElementById('name').value,
      apellido: document.getElementById('apellido').value,
      edad: document.getElementById('edad').value,
      alias: document.getElementById('alias').value,
      avatar: document.getElementById('avatar').value,

    },
    text: document.getElementById('texto').value
  }
  socket.emit('new-message', Post)
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
  let post = []
  let postsize = []
  for (let i = 0; i < data.length; i++) {
    const orgDesnormalizado = normalizr.denormalize(data[i].result, organigrama, data[i].entities)
    const realsize = normalizr.denormalize(data[i].result, autores, data[i].entities)
    postsize.push(realsize)
    post.push(orgDesnormalizado)
  }
  let sizeNormalizado = JSON.stringify(data).length
  let sizeDesnormalizado = JSON.stringify(postsize).length
  let procentaje = Math.round((sizeDesnormalizado / sizeNormalizado)*100)
  Procentaje([procentaje])
  render(post)
})

socket.on('product', (data) => {
  rendertabla(data)
})