import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { MessageData } from "@/schema/message.schema";

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