//faker
const faker = require( 'faker')
faker.locale = 'es'

//normalizr
const { normalize, schema, denormalize } = require('normalizr');
const autor = new schema.Entity('autor');
const mensaje = new schema.Entity('mensaje', {
    author: autor
});
const mensajes = new schema.Entity('mensajes', {
    mensajes: [mensaje]
});

module.exports = {
    
    generarUsuario: function () {
        const product_title = faker.commerce.productName()

        return {
            title: product_title,
            price: parseFloat(faker.commerce.price()),
            thumbnail: 'www.cdn/coder/products/' + product_title.replace(/ /g,"_")
        }
    },

    getCurrentDateTime: function (){
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date+' '+time
    },

    normalizar: function(data_og){
        return normalize(data_og, mensajes)
    }

}