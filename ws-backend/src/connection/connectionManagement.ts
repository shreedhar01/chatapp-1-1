import axios from "axios";
import { Socket } from "socket.io";
import { config } from "../config/env.js";
import { sendEvents } from "../events/sendEvents.js";

const connections = new Map<string, Set<Socket>>()

export async function addConnection(userId: string, socket: Socket) {
    try {
        if (!connections.has(userId)) {
            connections.set(userId, new Set())
            const response = await axios.get(`${config.REST_API_BACKEND}/friend/active/`, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })
            response.data.data.forEach((v: number) =>
                sendEvents(String(v), "user:online", userId)
            )
        }
        connections.get(userId)?.add(socket)
        // console.log("connections :: ", connections)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error on adding connection :: ", error.response?.data)
        } else {
            console.log("Error on Friend Request Handler :: ", error)
        }
    }
}


export async function removeConnection(userId: string, socket: Socket) {
    try {
        const userSockets = connections.get(userId)
        if (!userSockets) return
        for (const sock of userSockets) {
            if (sock.id === socket.id) {
                userSockets.delete(sock)
                break
            }
        }

        if (userSockets.size === 0) {
            const response = await axios.get(`${config.REST_API_BACKEND}/friend/active/`, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })
            response.data.data.forEach((v: number) =>
                sendEvents(String(v), "user:offline", userId)
            )
            connections.delete(userId)
        }

        // console.log("connections after remove:: ", connections)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error on adding connection :: ", error.response?.data)
        } else {
            console.log("Error on Friend Request Handler :: ", error)
        }
    }

}

export function getConnection(userId: string) {
    return connections.get(userId)
}