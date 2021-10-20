const socket = io();

function buscarPlantilla(url) {
    return fetch(url)
        .then(respuesta => respuesta.text())
}

function agregarMensaje(e){
    const mensaje = {
        author: document.getElementById('author').value,
        message: document.getElementById('message').value
        
    }
    console.log("Por mandar un mensaje: ", mensaje)
    socket.emit('nuevo-mensaje', mensaje)
    return false
}

socket.on("productos", async function(productos) {
    const plantilla = await buscarPlantilla('/plantillas/catalogo.hbs')
    
    const render = Handlebars.compile(plantilla);
    const html = render({ productos })
    
    console.log(productos)

    document.getElementById('catalogo').innerHTML = html
})


socket.on("mensajes", async function(mensajes) {
    const plantilla = await buscarPlantilla('/plantillas/chat.hbs')
    
    const render = Handlebars.compile(plantilla);
    const html = render({ mensajes })

    console.log(mensajes)

    document.getElementById('chat').innerHTML = html
})

socket.on("nuevo-mensaje", async function(mensajes) {
    const plantilla = await buscarPlantilla('/plantillas/chat.hbs')
    
    const render = Handlebars.compile(plantilla);
    const html = render({ mensajes })

    console.log(mensajes)

    document.getElementById('chat').innerHTML = html
})