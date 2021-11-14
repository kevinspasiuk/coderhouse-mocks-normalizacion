const { options } = require('../options/mariaDB')
const knex = require('knex')(options);

class ProductosContenedor {

    async getAll(){
        const filas_productos = await knex.from('productos').select('*');
        console.log()
        const productos = []
        
        filas_productos.forEach(fila => {
            const producto = JSON.parse(JSON.stringify(fila))
            productos.push(producto)
        });
        return productos
    }

    async save(producto) {
        await knex('productos').insert(producto)
    }
}

module.exports = ProductosContenedor;