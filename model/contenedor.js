const fs = require('fs')

class Contenedor {
  constructor (filePath) {
    this.path = filePath
  }

  async save (object) {
    const content = await this.getAll()
    object.id = this.getNextId(content)

    content.push(object)

    try {
      await fs.promises.writeFile(this.path, this.serialize(content))
      return object.id
    } catch (err) {
      throw new Error('Error al guardar dato', err)
    }
  }

  async getAll () {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      if (data === '') {
        return []
      }
      return JSON.parse(data)
    } catch (err) {
      if (err.code === 'ENOENT') {
        return []
      } else {
        throw new Error('Error al leer datos', err)
      }
    }
  }

  async getById (number) {
    const content = await this.getAll()
    let itemSearched = null
    content.forEach(element => {
      if (element.id === number) {
        itemSearched = element
      }
    })
    return itemSearched
  }

  async deleteById (number) {
    let content = await this.getAll()
    content = content.filter(x => {
      return x.id !== number
    })

    try {
      await fs.promises.writeFile(this.path, this.serialize(content))
    } catch (err) {
      throw new Error('Error al borrar dato', err)
    }
  }

  async deleteAll () {
    try {
      await fs.promises.writeFile(this.path, this.serialize([]))
    } catch (err) {
      throw new Error('Error al borrar dato', err)
    }
  }

  // private methods

  serialize (object) {
    return JSON.stringify(object, null, 2)
  }

  getNextId (objects) {
    const array = objects.map(x => x.id)
    if (array.length === 0) { return 1 }

    return Math.max(...array) + 1
  }
}

module.exports = Contenedor
