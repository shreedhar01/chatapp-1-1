import type { Socket } from "socket.io";
import { responseFriendRequestSchema, type ResponseFriendRequest } from "../types/event.types.js";
import axios from "axios";
import { config } from "../config/env.js";
import { sendEvents } from "../events/sendEvents.js";

export const friendRequestResponseHandler = (socket: Socket) => {
    socket.on("friend:request_response", async (data) => {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data)
            }

            const isValid = responseFriendRequestSchema.safeParse(data)
            if (!isValid.success) {
                throw Error("Invalid data")
            }

            const response = await axios
                .post(`${config.REST_API_BACKEND}/friend`,
                    isValid.data,
                    {
                        headers: {
                            Authorization: `Bearer ${socket.data.token}`
                        }
                    })


            console.log("Response :: ", response.data)
            sendEvents(
                String(socket.data.id),
                "friend:response_handled",
                { id: data.id, sender: data.sender }
            )

            if (data.status === "accepted") {
                sendEvents(
                    String(data.sender.id),
                    "friend:request_accepted",
                    response.data?.data[0]
                )
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios Error on friend request handler :: ", error.response?.data)
            } else {
                console.log("Error on Friend Request Handler :: ", error)
            }
        }
    })
}

export const allActiveFriendsHandler = (socket: Socket) => {
    socket.on("user:login", async () => {
        try {
            const allFriends = await axios.get(`${config.REST_API_BACKEND}/friend/active/`, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })

            // console.log("Response :: ", allFriends.data.data)
            allFriends.data.data.forEach((v:number) => {
                sendEvents(
                    String(v),
                    "user:online",
                    socket.data.id
                )
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Error while getting active friends :: ", error.response?.data)
            } else {
                console.log("Error while getting active friends :: ", error)
            }
        }
    })
}