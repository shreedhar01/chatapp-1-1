import { socket } from "@/lib/socket/socket";
import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.provider";

const SocketContext = createContext(socket)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading) return
        if (!user) {
            socket.disconnect()
            return
        }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [user, loading])
    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext)
}