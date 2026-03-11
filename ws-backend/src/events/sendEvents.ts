import { getConnection } from "../connection/connectionManagement.js";

export function sendEvents(userId: string, event: string, playload: any) {
    const socket = getConnection(userId)
    if (socket) {
        socket.emit(event, playload)
    }
}