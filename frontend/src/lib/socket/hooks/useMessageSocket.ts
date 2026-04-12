import { useSocket } from "@/providers/Socket.provider";
import type { Content, MessageData } from "@/schema/message.schema";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSentMessage(friendId: number) {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("message:send", async (data: Content) => {
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", friendId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            data: [data, ...page.data],
                        }
                    })
                }
            })
        })

        return () => {
            socket.off("message:send")
        }
    }, [socket])
}

export function useReceiveMessage() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("message:receive", async (data: Content) => {
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", data.senderId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            data: [data, ...page.data],
                        }
                    })
                }
            })
        })

        return () => {
            socket.off("message:receive")
        }
    }, [socket])
}