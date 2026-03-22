import { Socket, Server } from "socket.io";
import { verifyJwt } from "../utils/jwt.js";
import { config } from "../config/env.js";
import { addConnection, removeConnection } from "./connectionManagement.js";
import { friendRequestHandler } from "../handlers/friendRequestHandler.js";
import { cookieParser } from "../utils/cookieParser.js";
import { allActiveFriendsHandler, friendRequestResponseHandler } from "../handlers/friendRequestResponseHandler.js";

export async function handleConnection(socket: Socket, io: Server) {
    const cookieHeader = socket.handshake.headers.cookie || ""
    // console.log("cookie :: ",cookieHeader)
    const cookie = cookieParser(cookieHeader)
    try {
        const token = await verifyJwt(cookie.login!)
        if (new Date() > new Date(token.iat! * 1000 + config.JWT_LIFE)) {
            socket.disconnect()
        }
        const userId = token.id
        socket.data = {
            id:userId,
            token:cookie.login
        }

        addConnection(userId, socket)

        // friend
        friendRequestHandler(socket)
        friendRequestResponseHandler(socket)
        allActiveFriendsHandler(socket)

        socket.on("disconnect", () => {
            removeConnection(userId,socket.id)
        })
    } catch (error) {
        console.log("Error at connection handling :: ", error)
        socket.disconnect()
    }
}