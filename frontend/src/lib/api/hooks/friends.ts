import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import axios from "axios";
import type { FriendData, SearchFriend } from "@/schema/friend.schema";

// export function useSearchFriends() {
//     return useMutation({
//         mutationKey: ["searchFriends"],
//         mutationFn: async (input:SearchFriend):Promise<FriendData> => {
//             const response = await api.post("/friend/search", input,{
//                 params:{
//                     page : 1,
//                     limit : 20
//                 }
//             })
//             return response.data.data as FriendData
//         },
//         onSuccess: (data) => {
//             // console.log(data.data)
//         },
//         onError: (err) => {
//             if (axios.isAxiosError(err)) {
//                 const message = err.response?.data?.message ?? "Something went wrong"
//                 console.log("Error while searching friends :: ", message)
//                 // toast.error(message)
//             } else {
//                 // toast.error("Unexpected error occurred")
//                 console.log("Unexpected error occurred")
//             }
//         }
//     })
// }


export function useSearchFriends(name: string) {
    return useInfiniteQuery({
        queryKey: ["searchFriends", name],
        queryFn: async ({ pageParam = 1 }): Promise<FriendData> => {
            const response = await api.post("/friend/search", { name }, {
                params: { page: pageParam, limit: 20 }
            })
            console.log("infinite :: ", response.data.data)
            return response.data.data as FriendData
        },
        getNextPageParam: (lastPage) => {
            console.log("lst page :: ", lastPage)
            const pagination = lastPage[0].pagination
            return pagination.hasNext ? pagination.page + 1 : undefined
        },
        initialPageParam: 1,
        enabled: !!name,
    })
}