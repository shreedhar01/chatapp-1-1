import { LogOutIcon, MessageSquareTextIcon, SettingsIcon, UserRoundPlusIcon } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { useState } from "react"
import { useLogOut } from "@/lib/api/hooks/auth"
import { SearchFriends } from "./SearchFriends"
import { SettingsSection } from "./SettingsSection"
import { ChatSection } from "./ChatSection"

export const AppSideBar = () => {
    const [chat, setChat] = useState(true)
    const [addUser, setAddUser] = useState(false)
    const [setting, setSetting] = useState(false)

    const logOutMutation = useLogOut()

    return (
        <>
            <div className="flex flex-col-reverse md:flex-row h-screen w-full">
                <div className="flex md:flex-col gap-8 md:gap-0 justify-center md:justify-between items-center md:w-16 p-4 md:m-2 mx-2 mb-2 border border-gray-500 rounded-2xl shadow-2xl">
                    <div className="flex md:flex-col gap-8 md:gap-4">
                        <Button
                            title="Chat"
                            onClick={() => {
                                setChat(true)
                                setAddUser(false)
                                setSetting(false)
                            }}
                            className={`${chat ? 
                                "text-white dark:text-black":
                                "text-white hover:bg-gray-400 bg-gray-500"
                            }`}
                        >
                            <MessageSquareTextIcon />
                        </Button>
                        <Button
                            title="Add friends"
                            onClick={() => {
                                setChat(false)
                                setAddUser(true)
                                setSetting(false)
                            }}
                            className={`${addUser ? 
                                "text-white dark:text-black":
                                "text-white hover:bg-gray-400 bg-gray-500"
                            }`}
                        >
                            <UserRoundPlusIcon />
                        </Button>
                    </div>
                    <div className="flex md:flex-col items-center gap-8 md:gap-4">
                        <ModeToggle />
                        <Button
                            title="Settings"
                            onClick={() => {
                                setChat(false)
                                setAddUser(false)
                                setSetting(true)

                            }}
                            className={`${setting ? 
                                "text-white dark:text-black":
                                "text-white hover:bg-gray-400 bg-gray-500"
                            }`}
                        >
                            <SettingsIcon />
                        </Button>
                        <Button
                            title="LogOut"
                            onClick={async () => {
                                await logOutMutation.mutate()
                            }}
                            className="text-white hover:bg-gray-400 bg-gray-500"
                        >
                            <LogOutIcon />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col h-full min-h-0">
                    {chat ? <ChatSection /> : null}
                    {addUser ? <SearchFriends /> : null}
                    {setting ? <SettingsSection /> : null}
                </div>
            </div >
        </>
    )
}