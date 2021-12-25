const express = require('express')

const app = express()
const port = 8080

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const utils = require('./utils/utils.js')

app.use(express.urlencoded({ extended: true }));

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))

// app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.set('views', './views')

// Persistencia de mensajes
const MensajesContenedor = require('./model/mensajes.js')
const mensajesRepository = new MensajesContenedor()

//Persistencia de productos 
const ContenedorProductos = require('./model/productos.js');
const { range } = require('express/lib/request');
const productosRepository = new ContenedorProductos()


app.get('/', function (req, res){
  res.render('formulario.hbs')
});

app.get('/productos_test', function (req, res){
  const productos = [ ]

  for (i = 0; i < 5; i++) { 
    productos.push(utils.generarUsuario())
  };
  res.render('random.hbs',{layout :"productos_aleatorios.hbs",productos: productos});
});

app.post('/api/productos', async function (req, res){
  const producto = req.body
  console.log(producto)
  await productosRepository.save(producto)
  const productos = await productosRepository.getAll()
  io.sockets.emit('productos', productos )
  res.redirect('/')
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

io.on('connection', async (socket) => {
  
  console.log('[Nuevo usuario]');
  
  //emit de productos
  
  const productos = await productosRepository.getAll()
  socket.emit('productos', productos)
  
  //emit de mensajes 
  const output = {
    id: "mensajes"
  }

  mensajesRepository.getAll()
    .then(mensajes => {
      output.mensajes = mensajes
      console.log("[Enviando Normalizado]", JSON.stringify(utils.normalizar(output)))
      socket.emit('mensajes', utils.normalizar(output))
    })
  
  socket.on('nuevo-mensaje', mensaje =>{
    mensaje.datetime = utils.getCurrentDateTime()

    mensajesRepository.save(mensaje)
      .then( id => {
        console.log("[Nuevo mensaje] ", mensaje )
        mensajesRepository.getAll().then(mensajes => {
          output.mensajes = mensajes
          console.log("[Enviando Normalizado]", JSON.stringify(utils.normalizar(output)))
          socket.emit('mensajes', utils.normalizar(output))
        })
      }
    )
  })
});

server.on("error", error => console.log("error", error))