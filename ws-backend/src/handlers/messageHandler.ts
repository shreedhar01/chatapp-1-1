import { Socket, Server } from "socket.io";
import type { SendMessageEvent } from "../types/event.types.js";
import axios from "axios";

export function messageHandler(socket:Socket, io: Server){
    socket.on("send_message",async (data: SendMessageEvent)=>{
        try {
            const senderId = socket.data.id
            const response = await axios.post(`${process.env.REST_API_BACKEND}/message/add`,{
                from : senderId,
                to: data.to,
                message: data.message
            })
        } catch (error) {
            
        }
    })
}