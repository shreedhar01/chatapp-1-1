import { useSocket } from "@/providers/Socket.provider";
import type { DataWrapper, FriendItem } from "@/schema/friend.schema";
import type { Content, MessageData, NewMessage } from "@/schema/message.schema";
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


export function useMessageReadStatus(friendId: number) {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        const handleReadUpdate = ({ messages }: { conversationId: number, messages: Content[] }) => {

            if (messages.length === 0) return

            const latestMessage = messages.reduce((latest, msg) =>
                new Date(msg.createdAt) > new Date(latest.createdAt) ? msg : latest
            )

            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", friendId], (old) => {
                if (!old) return old

                const existingIds = new Set(old.pages.flatMap(p => p.data.map(m => m.id)))
                const newMessages = messages.filter(m => !existingIds.has(m.id))

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        const updatedData = page.data.map(msg => {
                            const updated = messages.find(m => m.id === msg.id)
                            return updated ? { ...msg, status: "read" as const } : msg
                        })

                        // Insert new messages (ones not in cache) into first page
                        if (index === 0 && newMessages.length > 0) {
                            return {
                                ...page,
                                data: [...newMessages, ...updatedData]
                            }
                        }

                        return { ...page, data: updatedData }
                    })
                }
            })


            // Update friend:accepted cache — update recentMessage
            queryClient.setQueryData<InfiniteData<DataWrapper>>(["friend:accepted"], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        data: page.data.map((friendItem): FriendItem => {
                            if (friendItem.friend.id !== friendId) return friendItem
                            if (!friendItem.conversation) return friendItem

                            const recentMsgId = friendItem.conversation.recentMessage?.id
                            const shouldUpdateStatus = recentMsgId && messages.some(m => m.id === recentMsgId)

                            if (shouldUpdateStatus) {
                                return {
                                    ...friendItem,
                                    conversation: {
                                        ...friendItem.conversation,
                                        recentMessage: {
                                            ...friendItem.conversation.recentMessage,
                                            status: "read" as const
                                        } as Content
                                    }
                                }
                            }

                            const currentRecent = friendItem.conversation.recentMessage
                            const latestIsNewer = !currentRecent ||
                                new Date(latestMessage.createdAt) > new Date(currentRecent.createdAt)

                            if (latestIsNewer) {
                                return {
                                    ...friendItem,
                                    conversation: {
                                        ...friendItem.conversation,
                                        recentMessage: latestMessage
                                    }
                                }
                            }

                            return friendItem
                        })
                    }))
                }
            })
        }

        socket.on("message:you_read", handleReadUpdate)
        socket.on("message:your_read", handleReadUpdate)

        return () => {
            socket.off("message:you_read", handleReadUpdate)
            socket.off("message:your_read", handleReadUpdate)
        }
    }, [socket, friendId, queryClient])
}
