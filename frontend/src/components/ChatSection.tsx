import { useGetAllFriends } from "@/lib/api/hooks/friends";
import { ScrollArea } from "./ui/scroll-area"
import { useEffect, useRef, useState } from "react";
import { Messages } from "./Messages";
import { ArrowLeftIcon, MessagesSquareIcon } from "lucide-react";
import type { FriendItem } from "@/schema/friend.schema";
import { useFriendOffline, useFriendOnline } from "@/lib/socket/hooks/useFriendSocket";
import { dateConverter } from "@/utils/dateConverter";

export const ChatSection = () => {
    const [friendId, setFriendId] = useState<FriendItem | null>(null)
    const friendSentialRef = useRef<HTMLDivElement>(null)

    const {
        data: allFriendData,
        fetchNextPage: allFriendFetchNextPage,
        hasNextPage: allFriendHasNextPage,
        isFetchingNextPage: allFriendIsFetchingNextPage,
        isLoading: allFriendIsLoading,
    } = useGetAllFriends();

    const friendData = allFriendData?.pages.flatMap(v => v.data) || []

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

    useFriendOnline()
    useFriendOffline()

    return (
        <div className="flex w-full h-full md:gap-2 bg-gray-200 dark:bg-gray-800">
            <div className={` ${friendId ? "hidden md:flex" : ""} flex flex-col w-full md:w-31/100 border-r border-gray-500 rounded-r-2xl bg-white dark:bg-black overflow-hidden`}>
                <p className=" text-xl font-bold p-3">Let's Chat</p>
                <ScrollArea className="flex-1 min-h-0 border rounded-2xl mb-2 mx-2 md:mr-2 overflow-hidden bg-gray-500">
                    <div className="flex flex-col gap-2 p-2 overflow-hidden">
                        {
                            friendData.map(v =>
                                <div
                                    key={v.id}
                                    onClick={() => setFriendId(v)}
                                    className={` ${friendId?.id === v.id ? "dark:bg-black bg-white" : "bg-gray-300 dark:bg-gray-800"} flex items-center justify-between  p-4 rounded-xl dark:hover:bg-black hover:bg-white`}
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
                                                    {v.friend.lastSeen ? dateConverter(String(v.friend.lastSeen)) : "none"}
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
                            <p className="text-center text-sm text-gray-400 py-2">Add more friends</p>
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
            <div className={` ${friendId ? "block w-full ml-2 md:ml-0" : "hidden"}  md:block md:w-69/100 border border-gray-500 rounded-2xl mr-2 bg-white dark:bg-black`}>
                <div className="flex-1 h-full min-h-0">
                    {
                        friendId ?
                            <div className="flex flex-col flex-1 h-full min-h-0">
                                <div className={`${friendId ? "flex" : "hidden"} items-center justify-between border-b dark:border-white rounded-t-2xl py-2 px-4`}>
                                    <button
                                    title="Back"
                                        onClick={() => setFriendId(null)}

                                    >
                                        <ArrowLeftIcon />
                                    </button>
                                    <p>{friendId.friend.name}</p>
                                </div>
                                <Messages friendItem={friendId} />
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center h-full">
                                <MessagesSquareIcon className="size-20 text-gray-500" />
                                <p className="text-4xl font-bold text-gray-500">Messages</p>
                                <p className="text-gray-400 dark:text-gray-600">Click user's to see your message</p>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}