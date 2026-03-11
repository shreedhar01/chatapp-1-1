import { Socket, Server } from "socket.io";
import { verifyJwt } from "../utils/jwt.js";
import { config } from "../config/env.js";
import { addConnection, removeConnection } from "./connectionManagement.js";
import { friendRequestHandler } from "../handlers/friendRequestHandler.js";

export async function handleConnection(socket:Socket,io:Server) {
    const cookieHeader = socket.handshake.headers.cookie || ""
    try {
        const token = await verifyJwt(cookieHeader)
        if(new Date() > new Date(token.iat!*1000+config.JWT_LIFE)){
            socket.disconnect()
        }
        const userId = token.id
        socket.data.id = userId
        
        addConnection(userId, socket)
        friendRequestHandler(socket, cookieHeader)
        
        socket.on("disconnect", ()=>{
            removeConnection(userId)
        })
    } catch (error) {
        console.log("Error at connection handling :: ",error)
        socket.disconnect()
    }
}