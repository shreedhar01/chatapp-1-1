import { Socket } from "socket.io";
import { createMessageSchema, readMessageSchema, type CreateNewMessage, type ReadMessage } from "../validation/message.validation.js";
import axios from "axios";
import { sendEvents } from "../events/sendEvents.js";
import { getConnection } from "../connection/connectionManagement.js";

export function createMessageHandler(socket: Socket) {
    socket.on("message:create", async (data: CreateNewMessage) => {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            const isDataValid = createMessageSchema.safeParse(data)
            if (!isDataValid.success) {
                throw Error("Invalid data formate")
            }

            const response = await axios.post(`${process.env.REST_API_BACKEND}/message/new`, isDataValid.data, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })

            const resData = response.data.data[0]
            console.log(resData)
            const receiverSockets = getConnection(String(isDataValid.data.receiverId))
            // console.log([...receiverSockets!])
            const receiverIsActive = receiverSockets && [...receiverSockets].some(
                s => s.data.activeConversationId === resData.conversationId
            )

            if (receiverIsActive) {
                try {
                    const readResponse = await axios.patch(
                        `${process.env.REST_API_BACKEND}/message`,
                        {
                            friendId: Number(socket.data.id),
                            activeConversationId: Number(resData.conversationId)
                        },
                        { headers: { Authorization: `Bearer ${socket.data.token}` } }
                    )
                    const readMessages = readResponse.data.data

                    sendEvents(String(socket.data.id), "message:your_read", {
                        conversationId: socket.data.activeConversationId,
                        messages: readMessages
                    })
                    
                    sendEvents(String(isDataValid.data.receiverId), "message:you_read", {
                        conversationId: socket.data.activeConversationId,
                        messages: readMessages
                    })
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log("Axios Error on friend request handler :: ", error.response?.data)
                    } else {
                        console.log("Error on Friend Request Handler :: ", error)
                    }
                    // fallback: send as delivered
                    sendEvents(String(isDataValid.data.receiverId), "message:receive", { message: resData })
                    sendEvents(String(socket.data.id), "message:send", { message: resData })
                }
                return
            }

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


export function readMessageHandler(socket: Socket) {
    socket.on("message:read", async (data: ReadMessage) => {
        try {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            const isDataValid = readMessageSchema.safeParse(data)
            if (!isDataValid.success) {
                throw Error("Invalid data formate")
            }
            const response = await axios.patch(`${process.env.REST_API_BACKEND}/message`, isDataValid.data, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })

            const resData = response.data.data[0]
            console.log("message:read ::", resData)
            sendEvents(String(isDataValid.data.friendId), "message:you_read", {
                conversationId: data.activeConversationId,
                messages: resData
            })
            sendEvents(String(socket.data.id), "message:your_read", {
                conversationId: data.activeConversationId,
                messages: resData
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios Error on message read handler :: ", error.response?.data)
            } else {
                console.log("Error on Friend Request Handler :: ", error)
            }
        }
    })
}