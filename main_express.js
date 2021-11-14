const express = require('express')

const app = express()
const port = 8080

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));

const exphbs = require('express-handlebars')
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))

// app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.set('views', './views')


function getCurrentDateTime(){
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date+' '+time
}


// Persistencia de mensajes
const Contenedor = require('./model/contenedor.js')
const mensajesRepository = new Contenedor()

//Persistencia de productos 
const ContenedorProductos = require('./model/productos.js')
const productosRepository = new ContenedorProductos()


app.get('/', function (req, res){
  res.render('formulario.hbs')
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
  
  console.log('a user connected');
  const productos = await productosRepository.getAll()
  socket.emit('productos', productos)
  
  mensajesRepository.getAll()
    .then(mensajes => socket.emit('mensajes', mensajes))
  
  socket.on('nuevo-mensaje', mensaje =>{
    mensaje.dateTime = getCurrentDateTime()
    
    mensajesRepository.save(mensaje)
      .then( id => {
        console.log("[Nuevo mensaje] ", mensaje )
        mensajesRepository.getAll().then(mensajes => io.sockets.emit('mensajes', mensajes))
      }
    )
  })
});

server.on("error", error => console.log("error", error))