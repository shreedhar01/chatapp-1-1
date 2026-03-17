import { useSocket } from "@/providers/Socket.provider";
import type { Friend, FriendData, FriendRequestData, Message } from "@/schema/friend.schema";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";

export function useFriendRequestSocket(name: string) {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("friend:request_sent", (data: { to: string }) => {
            // console.log("emit data :: ",data)
            queryClient.setQueryData<InfiniteData<FriendData>>(["friend:search", name], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.filter((friend: Friend) => friend.id !== Number(data.to))
                    }))
                }
            })
        })

        return () => {
            socket.off("friend:request_sent")
        }
    }, [socket, name])
}


export function useFriendRequestResponseSocket() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("friend:response_handled", (data) => {
            queryClient.setQueryData<InfiniteData<FriendRequestData>>(["friend:request"], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.filter((v: Message) => v.id !== Number(data.id))
                    }))
                }
            })
        })

        return () => {
            socket.off("friend:response_handled")
        }
    }, [socket])
}