import { ModeToggle } from "@/components/mode-toggle"

export const HomePage = () => {
    return (
        <div className="h-screen w-full p-4">
            <div className="flex w-full justify-between items-center  ">
                <p className="font-medium text-xl">Let's Chat</p>
                <ModeToggle />
            </div>
        </div>
    )
}