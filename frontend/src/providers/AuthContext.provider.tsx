import { createContext, useContext, useState } from "react";


interface UserData {
    name: string,
    email: string
}

interface AuthContextType {
    user: UserData | null
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
    const login = (userData: UserData) => setUser(userData)
    const logout = () => setUser(null)
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}