import React from "react"
import { createRoot } from "react-dom/client"
import { AgentZeroApp } from "./components/AgentZeroApp"
import "./styles.css"; // Reuse existing styles (Tailwind)

const container = document.getElementById("sidepanel-root")

if (container) {
    const root = createRoot(container)
    root.render(<AgentZeroApp />)
}
