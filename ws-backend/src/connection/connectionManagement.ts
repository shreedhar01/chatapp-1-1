import { Socket } from "socket.io";

const connections = new Map<string, Set<Socket>>()

export function addConnection(userId: string, socket: Socket) {
    if (!connections.has(userId)) {
        connections.set(userId, new Set())
    }
    connections.get(userId)?.add(socket)
    console.log("connections 2:: ", connections)
}

export function removeConnection(userId: string, socketId: string) {
    const userSockets = connections.get(userId)

    if (!userSockets) return

    for (const sock of userSockets) {
        if (sock.id === socketId) {
            userSockets.delete(sock)
            break
        }
    }

    if (userSockets.size === 0) {
        connections.delete(userId)
    }

    console.log("connections after remove:: ", connections)
}

export function getConnection(userId: string) {
    return connections.get(userId)
}