import { Socket } from "socket.io";

const connections = new Map<string, Socket>()

export function addConnection(userId:string,socket:Socket) {
    connections.set(userId,socket)
    // console.log("connections :: ", connections)
}

export function removeConnection(userId:string) {
    connections.delete(userId)
    // console.log("connection :: ",connections)
}

export function getConnection(userId:string) {
    return connections.get(userId)
}