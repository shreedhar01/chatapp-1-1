import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { DataWrapper, FriendData, FriendRequestData } from "@/schema/friend.schema";


export function useSearchFriends(name: string) {
    return useInfiniteQuery({
        queryKey: ["friend:search", name],
        queryFn: async ({ pageParam = 1 }): Promise<FriendData> => {
            const response = await api.post("/friend/search", { name }, {
                params: { page: pageParam, limit: 20 }
            })
            // console.log("raw response :: ", response.data)
            // console.log("response.data.data :: ", response.data.data)
            return response.data.data[0] as FriendData
        },
        getNextPageParam: (lastPage) => {
            // console.log("lst page :: ", lastPage)
            const pagination = lastPage.pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1,
        enabled: !!name,
    })
}

export function useFriendsRequst() {
    return useInfiniteQuery({
        queryKey: ["friend:request"],
        queryFn: async ({ pageParam = 1 }): Promise<FriendRequestData> => {
            const response = await api.get("/friend",{
                params: { page: pageParam, limit: 10 }
            })
            // console.log("raw response :: ", response.data)
            // console.log("response.data.data :: ", response.data.data)
            return response.data.data[0] as FriendRequestData
        },
        getNextPageParam: (lastPage) => {
            // console.log("lst page :: ", lastPage)
            const pagination = lastPage.pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1,
    })
}

export function useGetAllFriends() {
    return useInfiniteQuery({
        queryKey: ["friend:accepted"],
        queryFn: async ({ pageParam = 1 }): Promise<DataWrapper> => {
            const response = await api.get("/friend/accepted",{
                params: { page: pageParam, limit: 10 }
            })
            return response.data.data[0] as DataWrapper
        },
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1,
    })
}