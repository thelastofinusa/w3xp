import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { Layout } from "./components/shared/layout"

export function createApp(Component: React.ComponentType) {
  const root = document.getElementById("root")!
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Layout>
          <Component />
        </Layout>
      </ThemeProvider>
    </React.StrictMode>
  )
}
