import { createServer } from "http"
import { Server } from "socket.io"
import { config } from "./config/env.js"
import { handleConnection } from "./connection/lifeCycle.js"

const httpServer = createServer()

const io = new Server(httpServer,{
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173"
        ],
        credentials: true
    }
})

io.on("connection", (socket) => {
    handleConnection(socket,io)
})

httpServer.listen(config.PORT, () => {
    console.log("Socket.IO server running on :8080")
})