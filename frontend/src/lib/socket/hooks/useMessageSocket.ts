import { useSocket } from "@/providers/Socket.provider";
import type { DataWrapper } from "@/schema/friend.schema";
import type { MessageData, NewMessage } from "@/schema/message.schema";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSentMessage(friendId: number) {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("message:send", async ({ message: msgData }: NewMessage) => {
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", friendId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            data: [msgData, ...page.data],
                        }
                    })
                }
            })
            queryClient.setQueryData<InfiniteData<DataWrapper>>(["friend:accepted"], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map(data =>
                    ({
                        ...data,
                        data: data.data.map(friendItem => {
                            if (friendItem.friend.id !== friendId) return friendItem
                            if (!friendItem.conversation) return friendItem
                            return {
                                ...friendItem,
                                conversation: {
                                    ...friendItem.conversation,
                                    recentMessage: msgData,
                                }
                            }

                        })
                    })
                    )
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
        socket.on("message:receive", async ({ message: msgData }: NewMessage) => {
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", msgData.senderId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            data: [msgData, ...page.data],
                        }
                    })
                }
            })

            queryClient.setQueryData<InfiniteData<DataWrapper>>(["friend:accepted"], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map(data =>
                    ({
                        ...data,
                        data: data.data.map(friendItem => {
                            if (friendItem.friend.id !== msgData.senderId) return friendItem
                            if (!friendItem.conversation) return friendItem
                            return {
                                ...friendItem,
                                conversation: {
                                    ...friendItem.conversation,
                                    recentMessage: msgData,
                                }
                            }

                        })
                    })
                    )
                }
            })
        })

        return () => {
            socket.off("message:receive")
        }
    }, [socket])
}