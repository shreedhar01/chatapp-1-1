import { api } from "@/lib/api/axios";
import { createContext, useContext, useEffect, useState } from "react";


interface UserData {
    name: string,
    email: string
}

interface AuthContextType {
    user: UserData | null
    loading : boolean
    login: (userData: UserData) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthContextProvider")
    return context
}

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/user")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    },[])

    const login = (userData: UserData) => setUser(userData)
    const logout = () => setUser(null)
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}