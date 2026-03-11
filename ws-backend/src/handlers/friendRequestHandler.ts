import { Socket, Server } from "socket.io";
import type { AddFriendEvent } from "../types/event.types.js";
import axios from "axios";
import { config } from "../config/env.js";
import { sendEvents } from "../events/sendEvents.js";

export function friendRequestHandler(socket:Socket, io: Server) {
    socket.on("add_friend", async ( data: AddFriendEvent)=>{
        try {
            const senderId = socket.data.id
            const response = await axios.post(`${config.REST_API_BACKEND}/friend/add`,{
                senderId: senderId,
                to: data.to
            },{withCredentials:true})

            const saveFriendRequest = response.data

            sendEvents(data.to,"friend_request",{
                from: senderId,
                name: saveFriendRequest.name
            })
        } catch (error) {
            console.log("Error on friend request handler :: ",error)
        }
    })
}