const { normalize, schema, denormalize } = require( 'normalizr');

const autor = new schema.Entity('autor');

const mensaje = new schema.Entity('mensaje', {
  author: autor
});
const mensajes = new schema.Entity('mensajes', {
    mensajes: [mensaje]
});


const data_og = {
    id: "mensajes",
    mensajes : [
        {
            id: "1",
            author: {
                id: "kevin"
            },
            text: "holis!"
        },
        {
            id: "2",
            author: {
                id: "kevin"
            },
            text: "adiosii!"
        }
    ]

}

const norm = normalize(data_og, mensajes)
console.log(JSON.stringify(norm))


const desnormalizado = denormalize(norm.result, mensajes, norm.entities)
console.log(JSON.stringify(desnormalizado))