const { options } = require('../options/sqlite3')
const knex = require('knex')(options);
const { normalize, schema } = require( 'normalizr');

const autor = new schema.Entity('autor');

const mensaje = new schema.Entity('mensaje', {
  author: autor
});
const mensajes = new schema.Entity('mensajes', {
    mensajes: [mensaje]
});

class MensajesContenedor {

  async getAll () {
    try{
      const filas_mensajes= await knex.from('mensajes').select('*');
      const mensajes= []
      
      filas_mensajes.forEach(fila => {
          const mensaje = JSON.parse(JSON.stringify(fila))
          mensajes.push(mensaje)
      });

      const filas_autores = await knex.from('autores').select('*');
      
      const output = []

      mensajes.forEach(mensaje => {
        const autor = filas_autores.filter( autor => autor.mail == mensaje.author)
        mensaje.author = autor[0]
        output.push(mensaje)
      });

      return output
      
    }
    catch (error) {
      console.log(error)
    }
    
  }

  async save (data) {

    const mensaje = {
      author: data.author.id,
      text: data.text,
      datetime: data.datetime
    }

    const autor = {
      mail: data.author.id,
      name: data.author.name, 
      surname: data.author.surname,
      avatar: data.author.avatar
    }

    // podría mejorarse esto
    const filas_autores = await knex.from('autores').select('*').where({mail: data.author.id});
    if (filas_autores.length == 0) {
      await knex('autores').insert(autor)
    }

    await knex('mensajes').insert(mensaje)
  }

}

module.exports = MensajesContenedor
