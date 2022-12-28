import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import viewsRouter from "./routes/views.router.js"


const app = express()
const httpServer = app.listen(8080, ()=> console.log("listening on port 8080"))
const io = new Server(httpServer) // por convencion para wbsocket, io es la variable para el server. 

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(express.static( __dirname + "/public"))

app.use("/", viewsRouter )

let messages = []
io.on("connection", socket =>{
    console.log("New client connected")

    //escucha los mensajes de un user
    socket.on("message", data =>{
        messages.push(data)  //guardamos los msje

        io.emit("messageLogs", messages) // publicamos los mensajes para todos.  
    })
    socket.on("authenticated", user =>{
        socket.broadcast.emit("newUser", user)
    })
})
