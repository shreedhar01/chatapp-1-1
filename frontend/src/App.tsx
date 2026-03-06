import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { Provider } from "./providers/react-query.provider"
import { Dashboard } from "./pages/Dashboard"
import { useAuth } from "./providers/AuthContext.provider"
import { Spinner } from "./components/ui/spinner"



function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App


const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex w-full h-screen items-center justify-center ">
    <Spinner className=" size-20 "/>
  </div>
  if (!user) return <Navigate to="/" replace />
  return <Outlet />
}