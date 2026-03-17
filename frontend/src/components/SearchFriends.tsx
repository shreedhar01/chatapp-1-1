import { CheckIcon, PlusIcon, UserRoundPlusIcon, XIcon } from "lucide-react"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import { useSearchFriends } from "@/lib/api/hooks/friends";
import { useSocket } from "@/providers/Socket.provider";
import { useFriendRequestSocket } from "@/lib/socket/hooks/useFriendRequestSocket";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const SearchFriends = () => {
    const [openId, setOpenId] = useState<number | null>(null)
    const [name, setName] = useState("")
    const [debouncedName, setDebouncedName] = useState("")
    const sentinelRef = useRef<HTMLDivElement>(null)
    const socket = useSocket()
    // console.log("ref :: ", sentinelRef)

    const reqData = [
        {
            "id": 39,
            "sender": {
                "id": 34,
                "name": "Thirty Two"
            },
            "created_at": "2026-03-12T03:57:24.870Z"
        },
        {
            "id": 38,
            "sender": {
                "id": 33,
                "name": "Thirty One"
            },
            "created_at": "2026-03-12T03:57:24.867Z"
        },
        {
            "id": 37,
            "sender": {
                "id": 32,
                "name": "Thirty"
            },
            "created_at": "2026-03-12T03:57:24.865Z"
        },
        {
            "id": 36,
            "sender": {
                "id": 31,
                "name": "Twenty Nine"
            },
            "created_at": "2026-03-12T03:57:24.863Z"
        },
        {
            "id": 35,
            "sender": {
                "id": 30,
                "name": "Twenty Eight"
            },
            "created_at": "2026-03-12T03:57:24.861Z"
        },
        {
            "id": 34,
            "sender": {
                "id": 29,
                "name": "Twenty Seven"
            },
            "created_at": "2026-03-12T03:57:24.859Z"
        },
        {
            "id": 33,
            "sender": {
                "id": 28,
                "name": "Twenty Six"
            },
            "created_at": "2026-03-12T03:57:24.857Z"
        },
        {
            "id": 32,
            "sender": {
                "id": 27,
                "name": "Twenty Five"
            },
            "created_at": "2026-03-12T03:57:24.855Z"
        },
        {
            "id": 31,
            "sender": {
                "id": 26,
                "name": "Twenty Four"
            },
            "created_at": "2026-03-12T03:57:24.852Z"
        },
        {
            "id": 30,
            "sender": {
                "id": 25,
                "name": "Twenty Three"
            },
            "created_at": "2026-03-12T03:57:24.850Z"
        }
    ]

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

    useFriendRequestSocket(debouncedName)

    const friends = data?.pages.flatMap(page => page.data) ?? []

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

                        <ScrollArea className="flex-1 min-h-0 rounded-2xl">
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
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex flex-col gap-2  h-40/100">
                        <p className="text-gray-500 ">Friend Request</p>
                        <ScrollArea 
                        className="flex-1 min-h-0 rounded-2xl"
                        onScrollCapture={() => setOpenId(null)}
                        >
                            <div className="flex flex-col gap-1 p-1 rounded-2xl bg-gray-500">
                                {
                                    reqData.map(v =>
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
                                                    >
                                                        <CheckIcon />
                                                        <p >Accept</p>
                                                    </Button>
                                                    <Button
                                                        className="flex justify-start text-red-500 bg-gray-100 dark:bg-gray-900 hover:bg-red-200 dark:hover:bg-red-800"
                                                    >
                                                        <XIcon />
                                                        <p>Reject</p>
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )
                                }
                            </div>
                        </ScrollArea>
                    </div>

                    {isLoading && (
                        <p className="text-center text-sm text-gray-400">Searching...</p>
                    )}
                </div>
            </div>
            <div className="hidden md:flex flex-col w-69/100 items-center justify-center gap-4">
                <UserRoundPlusIcon className="size-20 text-gray-500" />
                <p className="text-4xl font-bold text-gray-500">Add Friends</p>
            </div>
        </div>
    )
}