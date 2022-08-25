const socket = io.connect()

function addResponse(user) {
    const message = {
        email: user,
        tipo: 'sistema',
        fechayHora: new Date().toLocaleString(),
        cuerpoMsg: document.getElementById('texto').value
    }
    socket.emit('new-message', message)
}

function addMessage(user) {
    const message = {
        email: user,
        tipo: 'usuario',
        fechayHora: new Date().toLocaleString(),
        cuerpoMsg: document.getElementById('texto').value
    }
    socket.emit('new-message', message)
}

socket.on('render-chat', (chat) => {
    if (document.getElementById('chat') != null) {
        const html = chat
            .map((elem, index) => {
                return `<div class=" m-2 d-flex justify-content-around bg-success bg-gradient rounded list-group-item">
                        <p class="m-1">${elem.cuerpoMsg}</p>
                        <p class="m-1">${elem.email}</p>
                        <p class="m-1">${elem.tipo}</p>
                        <p class="m-1">${elem.fechayHora}</p>
                    </div>`
            })
            .join(' ')
        document.getElementById('chat').innerHTML = html
    }
})

socket.on('render-chatAdmin', (chat) => {
    if (document.getElementById('chatAdmin') != null) {
        const html = chat
            .map((elem, index) => {
                return `<div class=" m-2 d-flex justify-content-around bg-success bg-gradient rounded list-group-item">
                        <p class="m-1">${elem.cuerpoMsg}</p>
                        <p class="m-1">${elem.email}</p>
                        <p class="m-1">${elem.tipo}</p>
                        <p class="m-1">${elem.fechayHora}</p>
                        <button onclick="addResponse('${elem.email}')" class="btn btn-success m-1">Enviar</button>
                    </div>`
            })
            .join(' ')
        document.getElementById('chatAdmin').innerHTML = html
    }
})