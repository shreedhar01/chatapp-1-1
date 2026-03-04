import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { ThemeProvider } from "@/components/theme-provider"


function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <HomePage/>}/>
      </Routes>
    </BrowserRouter>

    </ThemeProvider>
  )
}

export default App