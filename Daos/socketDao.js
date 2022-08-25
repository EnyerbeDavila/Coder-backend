const { findChatMessages, saveMessage } = require('../Persistencia/Pesistencia')

module.exports = {
    RenderChat: async (socket) => {
        let chat = await findChatMessages()
        socket.emit('render-chat', chat)
    },
    addMessage: async (message, socket) => {
        let chat = await saveMessage(message)
        socket.emit('render-chat', chat)
        socket.emit('render-chatAdmin', chat)
    },
    RenderChatAdm: async (socket) => {
        let chat = await findChatMessages()
        socket.emit('render-chatAdmin', chat)
    }
}