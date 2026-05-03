import type { Socket } from "socket.io";
import { activeConversationIdSchema } from "../validation/conversation.validation.js";
// import { getConnection } from "../connection/connectionManagement.js";

export const setActiveConversationId = (socket:Socket)=>{
    socket.on("message:active_conversation",async(data)=>{
        try {
            if(typeof data === "string"){
                data = JSON.parse(data)
            }
            const isValid = activeConversationIdSchema.safeParse(data)
            if(!isValid.success){
                throw isValid.error.issues.map(v => ({path:v.path[0], message: v.message}))
            }
            socket.data.activeConversationId = data.activeConversationId
            // console.log("socket.data :: ",socket.id)
            // console.log("socket :: ",getConnection(socket.data.id))
        } catch (error) {
            console.log("Error while setting active conversation id :: ",error)
        }
    })
}