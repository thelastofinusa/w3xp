import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "./components/provider/theme.provider"

export function createApp(Component: React.ComponentType) {
  const root = document.getElementById("root")!

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    </React.StrictMode>
  )
}
