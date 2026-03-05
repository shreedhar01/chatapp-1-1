import {
    LogIn,
    SignUp,
    ModeToggle
} from "@/components"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"

export const HomePage = () => {
    return (
        <div className="h-screen w-full p-4">
            <div className="flex w-full justify-between items-center  ">
                <p className="font-medium text-xl">Let's Chat</p>
                <ModeToggle />
            </div>
            <div className="flex w-full items-center justify-center pt-8">
                <Tabs defaultValue="signup" className="w-100">
                    <TabsList className="w-full">
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger value="login">Log In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <SignUp/>
                    </TabsContent>
                    <TabsContent value="login">
                        <LogIn/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}