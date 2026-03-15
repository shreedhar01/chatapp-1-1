import { Socket, Server } from "socket.io";
import type { AddFriendEvent } from "../types/event.types.js";
import axios, { AxiosError } from "axios";
import { config } from "../config/env.js";
import { sendEvents } from "../events/sendEvents.js";

export function friendRequestHandler(socket: Socket) {
    socket.on("friend:add", async (data: AddFriendEvent) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            const senderId = socket.data.id
            // console.log(`SenderId :: ${senderId} , Token :: ${JSON.stringify(socket.data.token)}`)

            console.log(`senderId ${senderId} data :: ${data.to}`)
            const response = await axios.post(`${config.REST_API_BACKEND}/friend/add`, {
                senderId: String(senderId),
                to: String(data.to)
            }, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })
            // console.log("response :: ", response)

            const saveFriendRequest = response.data
            console.log("log from ws backend :: ", saveFriendRequest)

            sendEvents(senderId,"friend:request_sent",{
                to: String(data.to)
            })

            sendEvents(String(data.to), "friend:request_received", {
                from: senderId,
                name: saveFriendRequest.name
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios Error on friend request handler :: ", error.response?.data)
            } else {
                console.log("Error on Friend Request Handler :: ", error)
            }
        }
    })
}