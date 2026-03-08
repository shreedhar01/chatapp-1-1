import { LogOutIcon, MessageSquareTextIcon, SettingsIcon, UserRoundPlusIcon } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { useState } from "react"
import { useLogOut } from "@/lib/api/hooks/auth"
import { useNavigate } from "react-router-dom"

export const AppSideBar = () => {
    const [chat, setChat] = useState(true)
    const [addUser, setAddUser] = useState(false)
    const [setting, setSetting] = useState(false)

    const logOutMutation = useLogOut()
    const navigate = useNavigate()

    return (
        <>
            <div className="flex h-screen w-33/100">
                <div className="flex flex-col justify-between items-center w-10/100 p-4">
                    <div className="flex flex-col gap-4">
                        <Button
                            title="Chat"
                            onClick={() => {
                                setChat(true)
                                setAddUser(false)
                                setSetting(false)
                            }}
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
                        >
                            <UserRoundPlusIcon />
                        </Button>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <ModeToggle />
                        <Button
                            title="Settings"
                            onClick={() => {
                                setChat(false)
                                setAddUser(false)
                                setSetting(true)

                            }}
                        >
                            <SettingsIcon />
                        </Button>
                        <Button
                            title="LogOut"
                            onClick={async()=>{
                                await logOutMutation.mutate()
                            }}
                        >
                            <LogOutIcon />
                        </Button>
                    </div>
                </div>
                <div className="bg-red-500 w-90/100">
                    hey
                </div>
            </div >
        </>
    )
}