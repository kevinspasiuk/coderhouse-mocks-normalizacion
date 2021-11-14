const { options } = require('../options/sqlite3')
const knex = require('knex')(options);

knex.schema.createTable('mensajes', (table) => {
    table.increments('id')
    table.string('author')
    table.integer('message')
    table.string('dateTime')
  })
  .then(() => console.log('Tabla creada'))
  .catch( (err) => { console.log(err); throw err })
  .finally( () => knex.destroy() );