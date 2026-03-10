import { PlusIcon, UserRoundPlusIcon } from "lucide-react"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { useEffect, useState, useRef } from "react";
import { useSearchFriends } from "@/lib/api/hooks/friends";

export const SearchFriends = () => {
    const [name, setName] = useState("")
    const [debouncedName, setDebouncedName] = useState("")
    const sentinelRef = useRef<HTMLDivElement>(null)
    console.log("ref :: ", sentinelRef)

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

    const friends = data?.pages.flatMap(page => page[0].data) ?? []

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                console.log("entries :: ", entries)
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
        <div className="flex w-full h-full">
            <div className="flex-1 flex flex-col w-full md:w-31/100 md:border-r border-gray-500 rounded-2xl">
                <p className="text-xl font-bold p-3">Let's Chat</p>
                <div className="flex flex-col gap-4 mx-3 mb-3 h-full min-h-0">
                    <Input
                        placeholder="Enter a friend name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <ScrollArea className="flex-1 min-h-0 rounded-2xl">
                        <div className="flex flex-col gap-1 p-1 border rounded-2xl overflow-hidden bg-gray-500">
                            {friends.map((v) => (
                                <div
                                    key={v.id}
                                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 border p-2 rounded-xl"
                                >
                                    <p>{v.name}</p>
                                    <Button 
                                    title="Send Friend Request"
                                    className="bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-100"
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