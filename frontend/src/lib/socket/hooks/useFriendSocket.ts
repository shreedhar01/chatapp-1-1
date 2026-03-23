import { useSocket } from "@/providers/Socket.provider";
import type { DataWrapper, Friend, FriendData, FriendRequestData, Message } from "@/schema/friend.schema";
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


export function useFriendOnline() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("user:online", (data) => {
            // console.log("data online ::", data)
            const existingData = queryClient.getQueryData<InfiniteData<DataWrapper>>(['friend:accepted'])

            const userExists = existingData?.pages
                .flatMap((page) => page.data)
                .some((friendItem) => friendItem.friend.id === Number(data))

            if (userExists) {
                queryClient.setQueryData<InfiniteData<DataWrapper>>(
                    ['friend:accepted'],
                    (old) => {
                        if (!old) return old
                        return {
                            ...old,
                            pages: old.pages.map((page) => ({
                                ...page,
                                data: page.data.map((friendItem) =>
                                    friendItem.friend.id === Number(data)
                                        ? { ...friendItem, friend: { ...friendItem.friend, status: "active" } }
                                        : friendItem
                                ),
                            })),
                        }
                    }
                )
            } else {
                queryClient.invalidateQueries({ queryKey: ['friend:accepted'] })
            }
        })

        return () => {
            socket.off("user:online")
        }
    }, [socket])
}


export function useFriendOffline() {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        socket.on("user:offline", (data) => {
            // console.log("offline socket data :: ", data)
            // console.log("data type::", typeof data)
            // console.log("data.id::", data?.id)

            const existing = queryClient.getQueryData<InfiniteData<DataWrapper>>(['friend:accepted'])
            console.log("existing cache::", JSON.stringify(existing?.pages?.[0]?.data?.[0], null, 2))
            queryClient.setQueryData<InfiniteData<DataWrapper>>(['friend:accepted'], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        data: page.data.map((friendItem) =>
                            friendItem.friend.id === Number(data) ?
                                {
                                    ...friendItem,
                                    friend: { ...friendItem.friend, status: "offline" }
                                } :
                                friendItem
                        )
                    }))
                }
            })

        })

        return () => {
            socket.off("user:offline")
        }
    }, [socket])
}