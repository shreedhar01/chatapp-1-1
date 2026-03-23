import { CheckIcon, PlusIcon, UserRoundPlusIcon, XIcon } from "lucide-react"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import { useFriendsRequst, useSearchFriends } from "@/lib/api/hooks/friends";
import { useSocket } from "@/providers/Socket.provider";
import { useFriendRequestResponseSocket, useFriendRequestSocket } from "@/lib/socket/hooks/useFriendSocket";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const SearchFriends = () => {
    const [openId, setOpenId] = useState<number | null>(null)
    const [name, setName] = useState("")
    const [debouncedName, setDebouncedName] = useState("")
    const sentinelRef = useRef<HTMLDivElement>(null)
    const reqSentinelRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()
    // console.log("ref :: ", sentinelRef)


    useEffect(() => {
        if (!name) return
        const timer = setTimeout(() => setDebouncedName(name), 500)
        return () => clearTimeout(timer)
    }, [name])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useSearchFriends(debouncedName)

    const {
        data: requestData,
        fetchNextPage: reqFetchNextPage,
        hasNextPage: reqHasNextPage,
        isFetchingNextPage: reqIsFetchingNextPage,
        isLoading: reqIsLoading,
    } = useFriendsRequst();

    useFriendRequestSocket(debouncedName)
    useFriendRequestResponseSocket()

    const friends = data?.pages.flatMap(page => page.data) ?? []
    const reqData = requestData?.pages.flatMap(page => page.data) ?? []

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // console.log("entries :: ", entries)
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 0.1 }
        )
        if (sentinelRef.current) observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // console.log("entries :: ", entries)
                if (entries[0].isIntersecting && reqHasNextPage && !reqIsFetchingNextPage) {
                    reqFetchNextPage()
                }
            },
            { threshold: 0.1 }
        )
        if (reqSentinelRef.current) observer.observe(reqSentinelRef.current)
        return () => observer.disconnect()
    }, [reqHasNextPage, reqIsFetchingNextPage, reqFetchNextPage])

    return (
        <div className="flex w-full h-full overflow-hidden">
            <div className="flex-1 flex flex-col w-full md:w-31/100 md:border-r border-gray-500 rounded-2xl overflow-hidden">
                <p className="text-xl font-bold p-3">Let's Chat</p>
                <div className="flex flex-col gap-4 mx-3 mb-3 h-full min-h-0 overflow-hidden rounded-b-xl">
                    <div className="flex flex-col gap-2 h-60/100">
                        <p className="text-gray-500 ">Search Friends</p>
                        <Input
                            placeholder="Enter a friend name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <ScrollArea className="flex-1 min-h-0 rounded-2xl overflow-hidden">
                            <div className="flex flex-col gap-1 p-1 rounded-2xl bg-gray-500">
                                {friends.map((v) => (
                                    <div
                                        key={v.id}
                                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 border p-2 rounded-xl"
                                    >
                                        <p>{v.name}</p>
                                        <Button
                                            title="Send Friend Request"
                                            className="bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-100"
                                            onClick={() => socket.emit("friend:add", { to: v.id })}
                                        >
                                            <PlusIcon />
                                        </Button>
                                    </div>
                                ))}

                                {/* sentinel — when visible, triggers next page load */}
                                <div ref={sentinelRef} className="h-1" />

                                {isFetchingNextPage && (
                                    <p className="text-center text-sm text-gray-400 py-2">Loading more...</p>
                                )}
                                {friends.length > 0 && !hasNextPage && (
                                    <p className="text-center text-sm text-gray-400 py-2">No more results</p>
                                )}
                                {friends.length === 0 && (
                                    <p className="text-center text-sm text-gray-400 py-2">No Result</p>
                                )}
                                {isLoading && (
                                    <p className="text-center text-sm text-gray-400">Searching...</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex flex-col gap-2  h-40/100">
                        <p className="text-gray-500 ">Friend Request</p>
                        <ScrollArea
                            className="flex-1 min-h-0 rounded-2xl overflow-hidden"
                            onScrollCapture={() => setOpenId(null)}
                        >
                            <div className="flex flex-col gap-1 p-1 rounded-2xl bg-gray-500">
                                {
                                    reqData?.map(v =>
                                        <div
                                            key={v.id}
                                            className="group flex items-center justify-between  bg-gray-100 dark:bg-gray-900 p-2 rounded-xl"
                                        >
                                            <p>{v.sender.name}</p>
                                            <Popover
                                                open={openId === v.id}
                                                onOpenChange={(o) => setOpenId(o ? v.id : null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        className="flex items-center justify-center
                                                                    opacity-0 group-hover:opacity-100
                                                                    data-[state=open]:opacity-100
                                                                    transition-opacity
                                                                    text-white bg-gray-500 hover:bg-gray-400"
                                                        variant="outline"
                                                    >...</Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    align="end"
                                                    className="flex flex-col gap-1 w-40 bg-gray-500 p-1"
                                                >
                                                    <Button
                                                        className="flex justify-start text-green-500 bg-gray-100 dark:bg-gray-900 hover:bg-green-200 dark:hover:bg-green-800"
                                                        onClick={() => {
                                                            socket.emit("friend:request_response", {
                                                                id: v.id,
                                                                sender: v.sender,
                                                                status: "accepted"
                                                            })
                                                        }}
                                                    >
                                                        <CheckIcon />
                                                        <p >Accept</p>
                                                    </Button>
                                                    <Button
                                                        className="flex justify-start text-red-500 bg-gray-100 dark:bg-gray-900 hover:bg-red-200 dark:hover:bg-red-800"
                                                        onClick={() => {
                                                            socket.emit("friend:request_response", {
                                                                id: v.id,
                                                                sender: v.sender,
                                                                status: "block"
                                                            })
                                                        }}
                                                    >
                                                        <XIcon />
                                                        <p>Reject</p>
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )
                                }

                                <div ref={reqSentinelRef} className="h-1" />
                                {reqIsFetchingNextPage && (
                                    <p className="text-center text-sm text-gray-400 py-2">Loading more...</p>
                                )}
                                {reqData.length > 0 && !reqHasNextPage && (
                                    <p className="text-center text-sm text-gray-400 py-2">No more results</p>
                                )}
                                {reqData.length === 0 && (
                                    <p className="text-center text-sm text-gray-400 py-2">No Result</p>
                                )}
                                {reqIsLoading && (
                                    <p className="text-center text-sm text-gray-400">Searching...</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex flex-col w-69/100 items-center justify-center gap-4">
                <UserRoundPlusIcon className="size-20 text-gray-500" />
                <p className="text-4xl font-bold text-gray-500">Add Friends</p>
            </div>
        </div>
    )
}