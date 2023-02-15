import express from "express"
import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/cart.routes.js"
import {__dirname} from './path.js'
import {engine} from 'express-handlebars'
import * as path from 'path'
import { Server } from "socket.io"
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js"

/* Product manager */
import ProductManage from './controllers/ProductManager.js'
const productos = new ProductManage('src/models/products.json')
await productos.verifyStaticId()

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
   console.log(`Server en puerto ${PORT}`)
})

const io = new Server(server)
app.set('socketio', io)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("handlebars", engine()) //Config de hbs
app.set("view engine", "handlebars") //Defino mis vistas
app.set("views", path.resolve(__dirname, "./views")) //`${__dirname}/views`

//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', realTimeProductsRouter)

io.on("connection", socket => {
   socket.on('msgCliente', info => { // Captura de info de cliente
      console.log(info)
   })
   socket.emit('msgServer', 'Servidor conectado')
})