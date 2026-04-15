import type { FriendItem } from "@/schema/friend.schema"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { CheckCheckIcon, CheckIcon, SendIcon } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { dateConverter } from "@/utils/dateConverter"
import { useGetMessage, useSendMessage } from "@/lib/api/hooks/message"
import { messageSentSchema } from "@/schema/message.schema"
import { useEffect, useRef, useState, type SubmitEventHandler } from "react"
import { useSocket } from "@/providers/Socket.provider"
import { useReceiveMessage, useSentMessage } from "@/lib/socket/hooks/useMessageSocket"

export const Messages = ({ friendItem }: { friendItem: FriendItem }) => {
    const [message, setMessage] = useState("")
    const topMessageRef = useRef<HTMLDivElement>(null)
    const bottomMessageRef = useRef<HTMLDivElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const messageSendMutation = useSendMessage(friendItem.friend.id)
    const socket = useSocket()

    useSentMessage(friendItem.friend.id)
    useReceiveMessage()

    const {
        data: msgData,
        fetchNextPage: msgFetchNextPage,
        hasNextPage: msgHasNextPage,
        isFetchingNextPage: msgIsFetchingNextPage,
        isLoading: msgIsLoading,
    } = useGetMessage(friendItem.friend.id)

    const messageData = msgData?.
        pages.
        slice().
        reverse().
        flatMap(page => [...page.data].reverse()) ?? []

    const getViewport = () =>
        scrollAreaRef.current?.querySelector<HTMLDivElement>(
            "[data-radix-scroll-area-viewport]"
        )

    // Scroll to bottom on first load
    useEffect(() => {
        if (!msgIsLoading) {
            bottomMessageRef.current?.scrollIntoView({ behavior: "instant" })
        }
    }, [msgIsLoading, friendItem.friend.id])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && msgHasNextPage && !msgIsFetchingNextPage) {
                    const viewport = getViewport()
                    const prevScrollHeight = viewport?.scrollHeight ?? 0

                    msgFetchNextPage().then(() => {
                        requestAnimationFrame(() => {
                            if (viewport) {
                                viewport.scrollTop += viewport.scrollHeight - prevScrollHeight
                            }
                        })
                    })
                }
            },
            { threshold: 0.1 }
        )

        if (topMessageRef.current) observer.observe(topMessageRef.current)
        return () => observer.disconnect()
    }, [msgHasNextPage, msgIsFetchingNextPage, msgFetchNextPage])

    const sentMessage: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        try {
            const isValid = messageSentSchema.safeParse({ content: message, receiverId: friendItem.friend.id })
            if (!isValid.success) {
                throw isValid.error
            }
            if (friendItem.friend.status === "offline" || !friendItem.conversation) {
                messageSendMutation.mutate(isValid.data, {
                    onSuccess: () => {
                        setMessage("")
                    }
                })
            } else {
                socket.emit("message:create", { ...isValid.data, status: "delivered" })
                setMessage("")
            }
        } catch (error) {
            console.log("error while sending message :: ", error)
        }
    }

    useEffect(() => {
        if (messageData.length > 0) {
            bottomMessageRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messageData.length])

    // setting active converstaion id in socket.data
    useEffect(() => {
        if (friendItem.conversation?.conversationId) {
            socket.emit("message:active_conversation", { activeConversationId: friendItem.conversation.conversationId })
        }
        if (friendItem.conversation?.recentMessage?.status !== "read") {
            socket.emit("message:read", { friendId: friendItem.friend.id })
        }
    }, [friendItem.friend.id])

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-full overflow-hidden p-1 md:p-0">
            {
                messageData.length === 0 ?
                    <div>
                        <p className="text-4xl text-gray-500 p-4">Say Hello to {friendItem.friend.name}</p>
                    </div>
                    :
                    <div className="flex-1 flex items-center justify-center w-full overflow-hidden min-h-0">
                        <div className="
                    flex items-center justify-center
                    p-2
                    w-full h-full md:max-w-60/100 rounded-xl
                    bg-gray-100 dark:bg-gray-800
                ">
                            <div ref={scrollAreaRef} className="w-full h-full rounded-xl">
                                <ScrollArea className="w-full h-full rounded-xl">
                                    <div className="flex flex-col gap-3 px-2">
                                        <div ref={topMessageRef} className="h-1" />

                                        {msgIsFetchingNextPage && (
                                            <p className="text-center text-xs text-gray-400 py-2">
                                                Loading older messages...
                                            </p>
                                        )}

                                        {messageData.map(v => (
                                            <div
                                                key={v.id}
                                                className={`flex py-1 w-full ${v.senderId === friendItem.friend.id ? "justify-start" : "justify-end"}`}
                                            >
                                                <p className="bg-gray-300 dark:bg-gray-700 w-fit p-4 rounded-xl max-w-[70%]">
                                                    {v.content}
                                                    <span className="flex items-center justify-end gap-2 text-xs pt-2 text-gray-500">
                                                        <span>{dateConverter(v.createdAt)}</span>
                                                        {
                                                            v.status === "sent" ?
                                                                <CheckIcon className="size-4" /> :
                                                                v.status === "delivered" ?
                                                                    <CheckCheckIcon className="size-4" /> :
                                                                    <CheckCheckIcon className="size-4 text-green-500" />
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        ))}

                                        <div ref={bottomMessageRef} className="h-1" />
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
            }
            <div className="flex items-end justify-center w-full">
                <form
                    onSubmit={sentMessage}
                    className="
                        flex items-end justify-center
                        gap-4 py-4 px-8
                        w-full md:max-w-60/100 rounded-xl
                        bg-gray-200 dark:bg-gray-800
                ">
                    <Textarea
                        value={message}
                        placeholder={`Message ${friendItem.friend.name}`}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        className="w-full min-h-10 max-h-40 border border-gray-500 resize-none"
                    />
                    <Button
                        type="submit"
                        className="text-white hover:bg-gray-400 bg-gray-500"
                    >
                        <SendIcon />
                    </Button>
                </form>
            </div>
        </div>
    )
}