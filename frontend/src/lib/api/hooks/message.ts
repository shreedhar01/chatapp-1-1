import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { api } from "../axios";
import type { MessageData, MessageFormate } from "@/schema/message.schema";
import type { Content } from "@/schema/message.schema";

export function useGetMessage(friendId: number) {
    return useInfiniteQuery({
        queryKey: ["message:get",friendId],
        queryFn: async ({ pageParam = 1 }): Promise<MessageData> => {
            const response = await api.get("/message", {
                params: { page:pageParam, limit:10, friendId }
            })
            return response.data.data[0] as MessageData
        },
        getNextPageParam: (lastPage)=>{
            const pagination = lastPage.pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1
    })
}


export function useSendMessage(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey:["message:sent"],
        mutationFn:async(data:MessageFormate)=>{
            const response = await api.post("/message/new",data)
            console.log("res data :: ", response.data.data[0])
            return response.data.data[0] as Content
        },
        onSuccess: (res)=>{
            queryClient.setQueryData<InfiniteData<MessageData>>(["message:get"], (old)=>{
                if(!old) return old
                return{
                    ...old,
                    pages: old.pages.map((page)=> ({
                        ...page,
                        data: page.data.push(res)
                    }))
                }
            })
        }
    })
}