const { options } = require('../options/sqlite3')
const knex = require('knex')(options);

class Contenedor {

  async getAll () {
    try{
      const filas_mensajes= await knex.from('mensajes').select('*');
      console.log()
      const mensajes= []
      
      filas_mensajes.forEach(fila => {
          const mensaje = JSON.parse(JSON.stringify(fila))
          mensajes.push(mensaje)
      });
      return mensajes

    }
    catch (error) {
      console.log(error)
    }
    
  }

  async save (mensaje) {
    await knex('mensajes').insert(mensaje)
  }

}

module.exports = Contenedor
