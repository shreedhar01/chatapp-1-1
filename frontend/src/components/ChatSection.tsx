import { useGetAllFriends } from "@/lib/api/hooks/friends";
import { ScrollArea } from "./ui/scroll-area"
import { useEffect, useRef } from "react";

export const ChatSection = () => {
    const friendSentialRef = useRef<HTMLDivElement>(null)

    const {
        data: allFriendData,
        fetchNextPage: allFriendFetchNextPage,
        hasNextPage: allFriendHasNextPage,
        isFetchingNextPage: allFriendIsFetchingNextPage,
        isLoading: allFriendIsLoading,
    } = useGetAllFriends();

    const fData = allFriendData?.pages.flatMap(v => v.data) || []
    const friendData = [
        ...fData.filter(v => v.friend.status === "active"),
        ...fData.filter(v => v.friend.status === "offline")
    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && allFriendHasNextPage && !allFriendIsFetchingNextPage) {
                    allFriendFetchNextPage()
                }
            },
            { threshold: 0.1 }
        )
        if (friendSentialRef.current) observer.observe(friendSentialRef.current)
        return () => observer.disconnect()
    }, [allFriendIsFetchingNextPage, allFriendFetchNextPage, allFriendHasNextPage])

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col w-31/100 border-r border-gray-500 rounded-2xl">
                <p className=" text-xl font-bold p-3">Let's Chat</p>
                <ScrollArea className="flex-1 min-h-0 border rounded-2xl mb-2 mr-2 overflow-hidden">
                    <div className="flex flex-col gap-2 p-2 bg-gray-500">
                        {
                            friendData.map(v =>
                                <div
                                    key={v.id}
                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-4 rounded-xl"
                                >
                                    <p>{v.friend.name}</p>
                                    <div className="flex flex-col gap-2 items-end">
                                        {v.friend.status === "active" ?
                                            <div className="flex items-center justify-center gap-4">
                                                <p className="text-gray-500 text-xs">online</p>
                                                <p className="h-2 w-2 bg-green-500 rounded-full"></p>
                                            </div>
                                            :
                                            <div className="flex items-center justify-center gap-4">
                                                <p className="text-gray-500 text-xs">offline</p>
                                                <p className="h-2 w-2 bg-red-500 rounded-full"></p>
                                            </div>
                                        }

                                        {
                                            v.friend.status === "offline" ?
                                                <p className="text-gray-500 text-xs">
                                                    {v.friend.lastSeen ? new Date(`${v.friend.lastSeen}`).toLocaleString() : "none"}
                                                </p> : null

                                        }

                                    </div>
                                </div>
                            )
                        }
                        <div ref={friendSentialRef} className="h-1" />
                        {allFriendIsFetchingNextPage && (
                            <p className="text-center text-sm text-gray-400 py-2">Loading more...</p>
                        )}
                        {friendData.length > 0 && !allFriendHasNextPage && (
                            <p className="text-center text-sm text-gray-400 py-2">No more results</p>
                        )}
                        {friendData.length === 0 && (
                            <p className="text-center text-sm text-gray-400 py-2">No Result</p>
                        )}
                        {allFriendIsLoading && (
                            <p className="text-center text-sm text-gray-400">Searching...</p>
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className=" w-69/100">

            </div>
        </div>
    )
}