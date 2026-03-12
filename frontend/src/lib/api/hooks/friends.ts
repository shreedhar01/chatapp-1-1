import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { FriendData } from "@/schema/friend.schema";


export function useSearchFriends(name: string) {
    return useInfiniteQuery({
        queryKey: ["searchFriends", name],
        queryFn: async ({ pageParam = 1 }): Promise<FriendData> => {
            const response = await api.post("/friend/search", { name }, {
                params: { page: pageParam, limit: 20 }
            })
            // console.log("infinite :: ", response.data.data)
            return response.data.data as FriendData
        },
        getNextPageParam: (lastPage) => {
            // console.log("lst page :: ", lastPage)
            const pagination = lastPage[0].pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1,
        enabled: !!name,
    })
}