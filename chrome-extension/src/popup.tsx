// Popup interface for Agent Zero Chrome Extension
// Provides quick access to settings and actions

import React from "react"
import { createRoot } from "react-dom/client"
import "./styles.css" // Import global styles for Tailwind
import { AgentZeroApp } from "./components/AgentZeroApp"

// Mount the React app
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<AgentZeroApp />);
}