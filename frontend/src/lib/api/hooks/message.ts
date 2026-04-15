import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { api } from "../axios";
import type { MessageData, MessageFormate } from "@/schema/message.schema";
import type { Content } from "@/schema/message.schema";
import type { DataWrapper } from "@/schema/friend.schema";

export function useGetMessage(friendId: number) {
    return useInfiniteQuery({
        queryKey: ["message:get", friendId],
        queryFn: async ({ pageParam = 1 }): Promise<MessageData> => {
            const response = await api.get("/message", {
                params: { page: pageParam, limit: 10, friendId }
            })
            return response.data.data[0] as MessageData
        },
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1
    })
}


export function useSendMessage(friendId: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["message:sent"],
        mutationFn: async (data: MessageFormate) => {
            const response = await api.post("/message/new", data)
            console.log("res data :: ", response.data.data[0])
            return response.data.data[0] as Content
        },
        onSuccess: async (res, variables) => {
            const isMessageExist = queryClient.getQueryData<InfiniteData<MessageData>>(["message:get", friendId])
            if (!isMessageExist) {
                await queryClient.fetchInfiniteQuery({
                    queryKey: ["message:get", variables.receiverId],
                    queryFn: async ({ pageParam = 1 }): Promise<MessageData> => {
                        const response = await api.get("/message", {
                            params: { page: pageParam, limit: 10, friendId: variables.receiverId }
                        })
                        return response.data.data[0] as MessageData
                    },
                    initialPageParam: 1,
                })
                return
            }
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get", friendId], (old) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            data: [res, ...page.data],
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
                                    recentMessage: res,
                                }
                            }

                        })
                    })
                    )
                }
            })
        }
    })
}