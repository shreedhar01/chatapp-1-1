import { Socket } from "socket.io";
import { createMessageSchema, type CreateNewMessage } from "../types/event.types.js";
import axios from "axios";
import { sendEvents } from "../events/sendEvents.js";

export function createMessageHandler(socket: Socket) {
    socket.on("message:create", async (data: CreateNewMessage) => {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            const isDataValid = createMessageSchema.safeParse(data)
            if(!isDataValid.success){
                throw Error("Invalid data formate")
            }
            const response = await axios.post(`${process.env.REST_API_BACKEND}/message/new`, isDataValid.data, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })

            const resData = response.data.data[0]
            sendEvents(String(isDataValid.data.receiverId), "message:receive", resData)
            sendEvents(String(socket.data.id), "message:send", resData)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios Error on friend request handler :: ", error.response?.data)
            } else {
                console.log("Error on Friend Request Handler :: ", error)
            }
        }
    })
}