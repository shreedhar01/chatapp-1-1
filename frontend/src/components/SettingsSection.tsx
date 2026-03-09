import { SettingsIcon } from "lucide-react"

export const SettingsSection = () => {
    return (
        <div className="flex w-full h-full">
            <div className="flex-1 flex flex-col md:w-31/100 md:border-r border-gray-500">
                <p className=" text-xl font-bold p-3">Let's Chat</p>
                <div className="mx-3">
                    settings
                </div>
            </div>
            <div className="hidden md:flex flex-col w-69/100 items-center justify-center gap-4">
                <SettingsIcon className="size-20 text-gray-500"/>
                <p className="text-4xl font-bold text-gray-500">Settings</p>
            </div>
        </div>
    )
}