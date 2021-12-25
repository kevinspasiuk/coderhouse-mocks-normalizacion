const { options } = require('../options/sqlite3')
const knex = require('knex')(options);

knex.schema.createTable('mensajes', (table) => {
    table.increments('id')
    table.string('author')
    table.string('text')
    table.string('dateTime')
  })
  .then(() => console.log('Tabla creada'))
  .catch( (err) => { console.log(err); throw err })
  .finally( () => knex.destroy() );

knex.schema.createTable('autores', (table) => {
    table.increments('id')
    table.string('mail')
    table.string('name')
    table.string('surname')
    table.string('avatar')
  })
  .then(() => console.log('Tabla creada'))
  .catch( (err) => { console.log(err); throw err })
  .finally( () => knex.destroy() );