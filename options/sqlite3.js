const path = require('path');

const options = {
    client: 'sqlite3',
    connection: {
      filename: path.resolve('./db/mensajes_db.sqlite')
    },
    useNullAsDefault: true

}
module.exports = { options }