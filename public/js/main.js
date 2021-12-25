const socket = io();

    
const autor = new normalizr.schema.Entity('autor');
const mensaje = new normalizr.schema.Entity('mensaje', {
    author: autor
});
const schema = new normalizr.schema.Entity('mensajes', {
    mensajes: [mensaje]
});


function buscarPlantilla(url) {
    return fetch(url)
        .then(respuesta => respuesta.text())
};

function agregarMensaje(e){
    const mensaje = {
        author: {
            id: document.getElementById('author').value,
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            avatar: document.getElementById('avatar').value,
        },
        text: document.getElementById('message').value   
    }

    console.log("Por mandar un mensaje: ", mensaje)
    socket.emit('nuevo-mensaje', mensaje)
    return false
};

socket.on("productos", async function(productos) {
    const plantilla = await buscarPlantilla('/plantillas/catalogo.hbs')
    
    const render = Handlebars.compile(plantilla);
    const html = render({ productos })
    
    console.log(productos)

    document.getElementById('catalogo').innerHTML = html
})


socket.on("mensajes", async function(data) {

    console.log("Data",data)

    const size_comprimido = JSON.stringify(data).length
    const desnormalizado = normalizr.denormalize(data.result, schema, data.entities)
    console.log(size_comprimido)

    const plantilla = await buscarPlantilla('/plantillas/chat.hbs')
    const render = Handlebars.compile(plantilla);

    const mensajes = desnormalizado.mensajes
    const size_og = JSON.stringify(desnormalizado).length

    console.log(size_og)

    const info = {
        mensajes : mensajes,
        compresion : 100 - Math.round((size_comprimido * 100) / size_og)
    }
    const html = render({ info })
    
    document.getElementById('chat').innerHTML = html
})