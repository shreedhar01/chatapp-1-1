import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthContextProvider } from './AuthContext.provider'
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SocketProvider } from './Socket.provider'

export function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
            },
        },
    }))

    return (
        <AuthContextProvider>
            <SocketProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <SidebarProvider>
                                    {children}
                                    <Toaster
                                        position="bottom-right"
                                        reverseOrder={false}
                                    />
                                    <ReactQueryDevtools initialIsOpen={false} />
                                </SidebarProvider>
                            </Tooltip>
                        </TooltipProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </SocketProvider>
        </AuthContextProvider>
    )
}