import { getConnection } from "../connection/connectionManagement.js";

export function sendEvents(userId: string, event: string, playload: any) {
    const sockets = getConnection(userId)
    // console.log("Socket event :: ",event)
    if (!sockets) return

    sockets.forEach((socket) => {
        socket.emit(event, playload)
    })
}