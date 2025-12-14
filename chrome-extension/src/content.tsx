// Content script for GitHub/GitLab integration
// Injects Agent Zero UI elements and handles page interactions

import React from "react"
import { createRoot } from "react-dom/client"
import { AgentZeroApp } from "./components/AgentZeroApp"
import { Bot, Zap, Shield, FileText, X, ChevronLeft } from "lucide-react"

// Chrome messaging wrapper
const sendToBackground = async (message: any): Promise<any> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
};

// GitHub/GitLab detection
const isGitHub = window.location.hostname === "github.com"
const isGitLab = window.location.hostname === "gitlab.com"

if (!isGitHub && !isGitLab) {
  console.log("Agent Zero: Not on GitHub or GitLab, skipping injection")
} else {
  console.log(`Agent Zero: Initializing on ${isGitHub ? "GitHub" : "GitLab"}`)
  initializeAgentZero()
}

interface PRInfo {
  repository: string
  prNumber: string
  prUrl: string
  branch: string
  baseBranch: string
}

interface MCSData {
  score: number
  status: "MERGE_CANDIDATE" | "NEEDS_REVIEW" | "AUTOCORRECT"
  reasoning?: string
  risks?: string[]
  lastUpdated: string
}

let currentPR: PRInfo | null = null
let mcsData: MCSData | null = null

// SVGs
const ICONS = {
  BOT: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
  SEARCH: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`, // Changed to MessageCircle for better context
  SHIELD: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
  ZAP: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  FILE_TEXT: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  X: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>`,
  SCAN_EYE: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>`,
  HAT_GLASSES: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h20"/><path d="M12 2v8"/><path d="m5.2 10 4.8 6.4 1 3.6"/><path d="m18.8 10-4.8 6.4-1 3.6"/></svg>`
}


function initializeAgentZero() {
  // Wait for page to load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupAgentZero)
  } else {
    setupAgentZero()
  }
}

function setupAgentZero() {
  console.log("Agent Zero: Setup triggered", window.location.href);

  // 1. Always inject global components
  injectSidePanel()
  setupGlobalListeners()

  // 2. Check for PR context immediately
  checkAndInject(0)

  // 3. Setup Navigation Listener (if not already set)
  // Check if listener attached flag exists? We rely on it being idempotent or calling cleanup.
  setupNavigationListener()
}

function checkAndInject(attempt: number) {
  if (isPullRequestPage()) {
    currentPR = extractPRInfo()
    if (currentPR) {
      console.log("Agent Zero: PR detected, checking DOM readiness...");
      if (document.querySelector(".gh-header-meta") || document.querySelector(".timeline-comment-actions")) {
        console.log("Agent Zero: DOM ready, injecting...");
        injectPRInterface()
        loadMCSScore()
      } else {
        if (attempt < 5) {
          setTimeout(() => checkAndInject(attempt + 1), 1000)
        }
      }
    }
  }
}

function isPullRequestPage(): boolean {
  if (isGitHub) {
    return /\/pull\/\d+/.test(window.location.pathname)
  } else if (isGitLab) {
    return /\/-\/merge_requests\/\d+/.test(window.location.pathname)
  }
  return false
}

function extractPRInfo(): PRInfo | null {
  try {
    if (isGitHub) {
      const pathParts = window.location.pathname.split("/")
      const repository = `${pathParts[1]}/${pathParts[2]}`
      const prNumber = pathParts[4]

      // Extract branch info from GitHub UI
      const branchInfo = document.querySelector(".head-ref")?.textContent?.trim()
      const baseBranchInfo = document.querySelector(".base-ref")?.textContent?.trim()

      return {
        repository,
        prNumber,
        prUrl: window.location.href,
        branch: branchInfo || "unknown",
        baseBranch: baseBranchInfo || "main"
      }
    } else if (isGitLab) {
      const pathParts = window.location.pathname.split("/")
      const repository = `${pathParts[1]}/${pathParts[2]}`
      const prNumber = pathParts[5]

      return {
        repository,
        prNumber,
        prUrl: window.location.href,
        branch: "unknown", // GitLab extraction would need more specific selectors
        baseBranch: "main"
      }
    }
  } catch (error) {
    console.error("Agent Zero: Failed to extract PR info", error)
  }
  return null
}

function injectPRInterface() {
  if (!currentPR) return

  // Inject MCS status badge
  injectMCSBadge()

  // Inject action buttons
  injectActionButtons()

  // Inject inline code analysis buttons
  injectInlineAnalysisButtons()
}

// Side Panel is now Native, but we still inject the Floating Trigger
function injectSidePanel() {
  const existingHost = document.getElementById("agent-zero-side-panel-host");
  if (existingHost) return; // Already injected

  const host = document.createElement("div");
  host.id = "agent-zero-side-panel-host";
  host.style.position = "fixed";
  host.style.top = "0";
  host.style.right = "0";
  host.style.zIndex = "2147483647"; // Max z-index
  host.style.pointerEvents = "none"; // Let clicks pass through container
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  // Inject Styles into Shadow DOM (Basic reset + functional)
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    button { pointer-events: auto; }
  `;
  shadow.appendChild(style);

  // Create Root for React
  const rootDiv = document.createElement("div");
  rootDiv.id = "agent-zero-root";
  shadow.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(<SidePanelController />);
}

function injectMCSBadge() {
  const targetSelector = isGitHub
    ? ".gh-header-meta"
    : ".detail-page-header-actions"

  const target = document.querySelector(targetSelector)
  if (!target) {
    console.warn("Agent Zero: Could not find target for MCS badge - falling back to title")
    // Fallback detection
    const backupTarget = document.querySelector(".js-issue-title")?.parentElement;
    if (backupTarget) {
      // Try checking title parent
    }
    return
  }

  // Remove existing badge if present
  const existingBadge = document.querySelector("#agent-zero-mcs-badge")
  if (existingBadge) {
    existingBadge.remove()
  }

  const badge = createMCSBadge()
  target.appendChild(badge) // Just append to meta area
}

function createMCSBadge(): HTMLElement {
  const badge = document.createElement("div")
  badge.id = "agent-zero-mcs-badge"
  badge.className = "agent-zero-mcs-badge"

  const score = mcsData?.score ?? 0
  const status = mcsData?.status ?? "ANALYZING"

  // Premium Green Dot Theme Status Colors
  const statusColors = {
    MERGE_CANDIDATE: "#10b981", // Emerald
    NEEDS_REVIEW: "#f59e0b",    // Amber
    AUTOCORRECT: "#3b82f6",     // Blue
    ANALYZING: "#6b7280"        // Gray
  }


  const bg = statusColors[status] || statusColors.ANALYZING
  const scorePercent = Math.min(Math.max(score, 0), 100);
  const barColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  badge.innerHTML = `
    <div class="agent-zero-badge-container" style="
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px;
      margin-left: 8px;
      background: #050505; 
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      font-family: ui-monospace, SFMono-Regular, system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    ">
      <!-- Icon Box -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${barColor};
        background: ${barColor}15;
        border-radius: 4px;
        padding: 4px;
      ">${ICONS.BOT}</div>

      <!-- Info Column -->
      <div style="display: flex; flex-direction: column; gap: 4px;">
         <div style="display: flex; justify-content: space-between; align-items: center; width: 80px;">
             <span style="font-size: 10px; color: #9ca3af; font-weight: 500;">MCS SCORE</span>
             <span style="font-size: 11px; font-weight: 700; color: white;">${score}</span>
         </div>
         
         <!-- Visual Bar Graph -->
         <div style="
            width: 80px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            overflow: hidden;
         ">
            <div style="
               width: ${scorePercent}%;
               height: 100%;
               background: ${barColor};
               border-radius: 2px;
               transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
               box-shadow: 0 0 8px ${barColor}80;
            "></div>
         </div>
      </div>
    </div>
  `

  badge.addEventListener("click", () => {
    // Open Side Panel
    sendToBackground({ type: "OPEN_SIDE_PANEL" });

    // Send data to AgentZeroApp (via Background loopback)
    // We send a message to background which then broadcasts it back to the tab
    if (mcsData) {
      // We can't easily message the React app directly from here because it's in Shadow DOM.
      // But the React app listens to chrome.runtime.onMessage.
      // So we ask background to "Broadcast" this data to this tab.
      chrome.runtime.sendMessage({
        type: "BROADCAST_MCS_DETAILS",
        data: mcsData
      });
    }
  })

  // Hover effects
  const container = badge.firstElementChild as HTMLElement
  badge.addEventListener("mouseenter", () => {
    container.style.transform = "translateY(-1px)"
    container.style.boxShadow = `0 0 20px rgba(16, 185, 129, 0.2)`
    container.style.borderColor = "#10b981"
  })
  badge.addEventListener("mouseleave", () => {
    container.style.transform = "translateY(0)"
    container.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.1)"
    container.style.borderColor = "rgba(16, 185, 129, 0.2)"
  })

  return badge
}

function injectActionButtons() {
  let target: Element | null = null;
  let insertionMethod: 'append' | 'after' = 'append';

  // Strategy 1: The standard comment actions bar (safest)
  // Strategy 2: The comment header (nicer looking)

  if (isGitHub) {
    // Try standard Actions bar first as it's the most stable anchor
    target = document.querySelector(".timeline-comment-actions");

    // If not found, try finding the whole comment header
    if (!target) {
      target = document.querySelector(".timeline-comment-header");
      insertionMethod = 'after'; // Inject after header if we can't find actions
    }
  } else {
    target = document.querySelector(".note-actions");
  }

  if (!target) return;

  // Check if already injected
  if (document.querySelector(".agent-zero-actions")) return;

  const buttonContainer = document.createElement("div")
  buttonContainer.className = "agent-zero-actions"

  // Force a new row using flexbox manipulation
  buttonContainer.style.cssText = `
        display: flex;
        gap: 8px;
        width: 100%;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.05);
        flex-wrap: wrap;
        align-items: center;
        flex-basis: 100%; /* Forces new line in flex wrap */
    `

  const buttons = [
    { text: "Analyze", icon: ICONS.SEARCH, action: "analyze", color: "#10b981" },
    { text: "Scan", icon: ICONS.SCAN_EYE, action: "security", color: "#ef4444" }, // Updated to SCAN_EYE
    { text: "Auto-Fix", icon: ICONS.HAT_GLASSES, action: "autofix", color: "#f59e0b" }, // Updated to HAT_GLASSES
    { text: "Generate Tests", icon: ICONS.FILE_TEXT, action: "tests", color: "#8b5cf6" }
  ]

  buttons.forEach(btn => {
    const button = createActionButton(btn.text, btn.icon, btn.action, btn.color)
    buttonContainer.appendChild(button)
  })

  if (insertionMethod === 'after') {
    target.parentNode?.insertBefore(buttonContainer, target.nextSibling);
  } else {
    // If appending to actions bar, we need to make sure the actions bar wraps
    if (target instanceof HTMLElement) {
      target.style.flexWrap = "wrap";
    }
    target.appendChild(buttonContainer);
  }
}

function createActionButton(text: string, icon: string, action: string, color: string): HTMLElement {
  const button = document.createElement("button")
  button.className = `agent-zero-action-btn agent-zero-${action}`

  button.innerHTML = `
    <span style="font-size: 14px; display: flex; align-items: center;">${icon}</span>
    <span>${text}</span>
  `

  button.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    color: #e5e7eb;
  `

  button.addEventListener("mouseenter", () => {
    button.style.background = `${color}15` // 15 = low opacity
    button.style.color = color
    button.style.borderColor = color
    button.style.boxShadow = `0 0 15px ${color}30`
  })

  button.addEventListener("mouseleave", () => {
    button.style.background = "rgba(255,255,255,0.03)"
    button.style.color = "#e5e7eb"
    button.style.borderColor = "rgba(255,255,255,0.1)"
    button.style.boxShadow = "none"
  })

  button.addEventListener("click", (e) => {
    e.preventDefault()
    handleActionClick(action)
  })

  return button
}

function injectInlineAnalysisButtons() {
  // Add "Explain" buttons to code lines
  const codeLines = document.querySelectorAll(".blob-code-inner, .line")

  codeLines.forEach((line, index) => {
    if (index % 10 === 0) { // Add button every 10 lines to avoid clutter
      const button = document.createElement("button")
      button.className = "agent-zero-explain-btn"
      button.innerHTML = ICONS.ZAP
      button.title = "Ask Agent Zero"
      button.style.cssText = `
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        border: 1px solid #10b981;
        background: rgba(16,185,129,0.1);
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s ease;
        font-size: 10px;
        color: #10b981;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 0 10px rgba(16,185,129,0.2);
        padding: 2px;
      `

      const lineContainer = line.closest("tr") || line.parentElement
      if (lineContainer) {
        lineContainer.style.position = "relative"
        lineContainer.appendChild(button)

        lineContainer.addEventListener("mouseenter", () => {
          button.style.opacity = "1"
          button.style.transform = "translateY(-50%) scale(1)"
        })

        lineContainer.addEventListener("mouseleave", () => {
          button.style.opacity = "0"
          button.style.transform = "translateY(-50%) scale(0.9)"
        })

        button.addEventListener("mouseenter", () => {
          button.style.background = "#10b981"
          button.style.color = "black"
          button.style.transform = "translateY(-50%) scale(1.2)"
        })

        button.addEventListener("mouseleave", () => {
          button.style.background = "rgba(16,185,129,0.1)"
          button.style.color = "#10b981"
          button.style.transform = "translateY(-50%) scale(1)"
        })

        button.addEventListener("click", (e) => {
          e.stopPropagation()
          const codeText = line.textContent || ""
          // Trigger explain by sending msg
          handleExplainSelection(codeText, "claude-3.5")
        })
      }
    }
  })
}

// Event handlers
async function handleActionClick(action: string) {
  if (!currentPR) return

  console.log(`Agent Zero: Triggering ${action} for PR`, currentPR)

  try {
    const response = await sendToBackground({
      type: "TRIGGER_ANALYSIS",
      data: {
        repository: currentPR.repository,
        pullRequest: {
          number: currentPR.prNumber,
          url: currentPR.prUrl,
          head: { ref: currentPR.branch },
          base: { ref: currentPR.baseBranch }
        },
        action
      }
    })

    if (response.success) {
      showNotification(`${action} started - Execution ID: ${response.executionId}`, "success")
      // Refresh MCS score after a delay
      setTimeout(loadMCSScore, 5000)
    } else {
      showNotification(`Failed to start ${action}: ${response.error}`, "error")
    }
  } catch (error) {
    console.error("Agent Zero: Action failed", error)
    showNotification(`Action failed: ${(error as any).message}`, "error")
  }
}

async function loadMCSScore() {
  if (!currentPR) return

  try {
    // Extract metadata for scoring
    const title = document.querySelector(".js-issue-title")?.textContent?.trim() || "";
    const description = document.querySelector(".comment-body")?.textContent?.trim() || "";

    // GitHub diff stats parsing
    let additions = 0;
    let deletions = 0;
    let files = 0;

    // Try standard header stats
    const diffStat = document.querySelector("#diffstat");
    if (diffStat) {
      const text = diffStat.textContent || "";
      const addMatch = text.match(/(\d+)\s+addition/);
      const delMatch = text.match(/(\d+)\s+deletion/);
      if (addMatch) additions = parseInt(addMatch[1]);
      if (delMatch) deletions = parseInt(delMatch[1]);
    } else {
      // Fallback to file counter tab
      const filesTab = document.querySelector("a[href$='/files'] .Counter");
      if (filesTab) files = parseInt(filesTab.textContent || "0");
    }

    const response = await sendToBackground({
      type: "GET_MCS_SCORE",
      data: {
        prUrl: currentPR.prUrl,
        title,
        description: description.substring(0, 2000),
        additions,
        deletions,
        files_changed_count: files
      }
    })

    if (response.success) {
      mcsData = {
        score: response.mcsScore || 0,
        status: response.status || "ANALYZING",
        reasoning: response.reasoning,
        risks: response.risks,
        lastUpdated: new Date().toISOString()
      }

      // Update badge
      injectMCSBadge()
    }
  } catch (error) {
    console.error("Agent Zero: Failed to load MCS score", error)
  }
}

function showNotification(message: string, type: "success" | "error" | "info" = "info") {
  const notification = document.createElement("div")
  notification.className = `agent-zero-notification agent-zero-${type}`

  const bgColors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6"
  }

  const bgColor = bgColors[type] || bgColors.info

  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 12px 16px;
    background: #050505;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    z-index: 10002;
    max-width: 320px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `

  notification.innerHTML = `
     <div style="width: 8px; height: 8px; border-radius: 50%; background: ${bgColor}; box-shadow: 0 0 10px ${bgColor}; flex-shrink: 0;"></div>
     <span style="line-height: 1.4;">${message}</span>
  `

  document.body.appendChild(notification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove()
  }, 5000)
}


// -- Global State --
let ghostModeActive = false;

function setupGlobalListeners() {
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message)

    switch (message.type) {
      case "ANALYZE_SELECTION":
        handleAnalyzeSelection(message.text, message.model)
        break
      case "EXPLAIN_SELECTION":
        handleExplainSelection(message.text, message.model)
        break
      case "SECURITY_SCAN_SELECTION":
        handleSecurityScanSelection(message.text, message.model)
        break
      case "TRIGGER_DEPENDENCY_SCAN":
        handleDependencyScan(message.model);
        break;
      case "START_GHOST_MODE":
        enableGhostMode();
        break;
      case "TRIGGER_EXPLANATION":
        // Triggered from Side Panel keyboard shortcut or button
        const selection = window.getSelection()?.toString().trim();

        if (selection) {
          handleExplainSelection(selection, "claude-3.5"); // Default model
        } else if (message.mode === 'security') {
          // If no selection for security, maybe scan the whole visible file?
          // For now, prompt user.
          showNotification("Please select code to scan.", "info");
        } else if (message.mode === 'diff') {
          // Handle diff explanation
          console.log("Triggering Diff Explanation");
          sendToBackground({ type: "OPEN_SIDE_PANEL" });

          // Gather Context (Title + Description)
          const title = document.querySelector(".js-issue-title")?.textContent?.trim() || "Unknown PR";
          const body = document.querySelector(".comment-body")?.textContent?.trim() || "No description provided.";

          const context = `PR Context:\nTitle: ${title}\nDescription: ${body.substring(0, 500)}...\n\nPlease analyze the intent of this Pull Request based on the description.`;

          handleExplainSelection(context, "claude-3.5");
        } else {
          // Fallback: Check if we are in Ghost Mode and user clicked something?
          showNotification("Please select some code first", "info");
        }
        break;
    }

    sendResponse({ success: true })
  })
}

function enableGhostMode() {
  ghostModeActive = true;

  // Create dim overlay
  const overlay = document.createElement('div');
  overlay.id = 'agent-zero-ghost-overlay';
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.4); /* 40% dim */
        z-index: 9998;
        pointer-events: none; /* Let clicks pass through to select text */
        transition: opacity 0.5s ease;
    `;
  document.body.appendChild(overlay);

  // Add tooltip follower
  const tooltip = document.createElement('div');
  tooltip.id = 'agent-zero-ghost-tooltip';
  tooltip.innerText = "Select any code to explain it";
  tooltip.style.cssText = `
        position: fixed;
        background: #10b981;
        color: black;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translate(10px, 10px);
    `;
  document.body.appendChild(tooltip);

  // Follow mouse
  const moveHandler = (e: MouseEvent) => {
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = e.clientY + 'px';
  };
  document.addEventListener('mousemove', moveHandler);

  // Detection handler to exit ghost mode
  const selectionHandler = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Success!
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', selectionHandler);
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        tooltip.remove();
      }, 500);
      ghostModeActive = false;
    }
  };
  document.addEventListener('mouseup', selectionHandler);
}


function handleDependencyScan(model: string) {
  // 1. Find package.json if visible
  // This is naive; ideally we'd use the GitHub API via the background script to fetch package.json content.
  // But for "Scan Page", we can check if we are viewing package.json.
  const path = window.location.pathname;
  if (!path.endsWith("package.json")) {
    showNotification("Please navigate to package.json to scan dependencies.", "info");
    return;
  }

  const rawContent = document.querySelector(".blob-wrapper")?.textContent || "";
  if (!rawContent) {
    showNotification("Could not read package.json content.", "error");
    return;
  }

  handleExplainSelection(rawContent, model); // Reuse explanation logic but context will be dependencies
}


function handleExplainSelection(text: string, model: string) {
  // If ghost mode was active, ensure it clears
  if (ghostModeActive) {
    const overlay = document.getElementById('agent-zero-ghost-overlay');
    if (overlay) overlay.remove();
    const tooltip = document.getElementById('agent-zero-ghost-tooltip');
    if (tooltip) tooltip.remove();
    ghostModeActive = false;
  }

  showNotification(`Explaining selected code with ${model}...`, "info")

  // Open the sidebar first
  sendToBackground({ type: "OPEN_SIDE_PANEL" });

  sendToBackground({
    type: "EXPLAIN_CODE",
    code: text,
    model
  }).then(response => {
    if (response.success) {
      // Communicate result to Side Panel (AgentZeroApp)
      // We do this by sending a specific message that the App listens for via chrome.runtime.onMessage
      // But content script cannot send message to itself easily via runtime.
      // Instead, we dispatch a DOM event that the React component listens to, OR we use basic messaging.
      // Since AgentZeroApp is in Shadow DOM, window events might be tricky if not composed.
      // Better: Send to background, background sends back to tab?
      // Simplest: Send to background then background broadcasts "ANALYSIS_COMPLETE"

      // For now, let's just use the mock result inside AgentZeroApp for the immediate UI feedback
      // In production, we'd pass this real data.
      chrome.runtime.sendMessage({
        type: "SHOW_ANALYSIS_RESULT",
        data: {
          summary: response.explanation || "Explanation generated.", // The real API returns markdown
          details: "Generated by Agent Zero AI.", // Placeholder for parsed structure
          risks: ["Check for edge cases"]
        }
      });

    } else {
      showNotification("Explanation failed: " + response.error, "error");
    }
  });
}

function setupNavigationListener() {
  // Prevent multiple listeners
  if ((window as any)._agentZeroNavListenerAttached) return;
  (window as any)._agentZeroNavListenerAttached = true;

  let lastUrl = window.location.href

  const handleUrlChange = () => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href
      console.log("Agent Zero: Navigation detected (Event), reinitializing")
      cleanupAndReinit()
    }
  }

  try {
    window.addEventListener("popstate", handleUrlChange)
    document.addEventListener("turbo:load", handleUrlChange)
    document.addEventListener("pjax:end", handleUrlChange)

    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href
        console.log("Agent Zero: Navigation detected (Poll), reinitializing")
        cleanupAndReinit()
      }
    }, 1000)
  } catch (e) {
    console.error("Agent Zero: Nav listener error", e);
  }
}

function cleanupAndReinit() {
  document.querySelectorAll("[id^='agent-zero-'], .agent-zero-").forEach(el => el.remove())
  setTimeout(setupAgentZero, 1500)
}

function handleAnalyzeSelection(text: string, model: string) {
  showNotification(`Analyzing selected code with ${model}...`, "info")

  sendToBackground({
    type: "ANALYZE_CODE",
    code: text,
    model
  }).then(response => {
    if (response.success) {
      showNotification("Analysis Complete: " + (response.summary || "Issues found"), "success")
    } else {
      showNotification("Analysis Failed", "error")
    }
  })
}

function handleSecurityScanSelection(text: string, model: string) {
  showNotification(`Scanning security with ${model}...`, "info")

  sendToBackground({
    type: "SECURITY_SCAN",
    code: text,
    model
  }).then(response => {
    if (response.success) {
      const issues = response.vulnerabilities?.length || 0;
      const type = issues > 0 ? "error" : "success"; // Error color for vulns found
      const msg = issues === 0 ? "No vulnerabilities found." : `Found ${issues} vulnerabilities.`;
      showNotification(`Scan Complete: ${msg}`, type);
    } else {
      showNotification("Scan failed", "error");
    }
  })
}

// -- React Side Panel Controller --
const SidePanelController: React.FC = () => {
  // Floating Action Button to toggle Native Side Panel
  const toggleSidePanel = () => {
    sendToBackground({ type: "OPEN_SIDE_PANEL" });
  };

  return (
    <button
      onClick={toggleSidePanel}
      title="Open Agent Zero"
      className="agent-zero-floating-trigger"
      style={{
        position: "fixed",
        bottom: "30px", // FAB style
        right: "30px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "#050505",
        border: "1px solid rgba(16, 185, 129, 0.4)",
        color: "#10b981",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6), 0 0 15px rgba(16, 185, 129, 0.2)",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        zIndex: 2147483647, // Max Z-Index
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.6), 0 0 15px rgba(16, 185, 129, 0.2)";
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: ICONS.BOT }} style={{ transform: "scale(1.4)" }} />
    </button>
  );
};