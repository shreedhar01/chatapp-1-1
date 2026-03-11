import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer,{
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173"
        ]
    }
})

io.on("connection", (socket) => {
    console.log("user connected:", socket.id)


    socket.on("send_message", (data) => {
        io.to(data.to).emit("new_message", {
            from: socket.id,
            message: data.message
        })
    })

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id)
    })
})

httpServer.listen(8080, () => {
    console.log("Socket.IO server running on :8080")
})