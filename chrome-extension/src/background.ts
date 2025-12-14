// Background service worker for Agent Zero Chrome Extension
// Handles API communication, notifications, and cross-tab messaging

// Chrome storage wrapper
const storage = {
  async get(key: string) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },
  async set(key: string, value: any) {
    await chrome.storage.local.set({ [key]: value });
  }
};

// Configuration
const AGENT_ZERO_API_BASE = "http://localhost:8080" // Kestra API
const DASHBOARD_API_BASE = "http://localhost:3000/api" // Next.js Dashboard API

interface AgentZeroConfig {
  apiKey?: string
  kestraUrl: string
  dashboardUrl: string
  enableNotifications: boolean
  selectedModels: {
    codeAnalysis: string
    securityScan: string
    autoFix: string
    documentation: string
  }
}

// Default configuration
const defaultConfig: AgentZeroConfig = {
  kestraUrl: AGENT_ZERO_API_BASE,
  dashboardUrl: DASHBOARD_API_BASE,
  enableNotifications: true,
  selectedModels: {
    codeAnalysis: "gemini-pro",
    securityScan: "gemini-pro",
    autoFix: "cline",
    documentation: "claude-3.5"
  }
}

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Agent Zero extension installed/updated", details)

  // Set default configuration
  await storage.set("config", defaultConfig)

  // Create context menu items
  chrome.contextMenus.create({
    id: "analyze-code",
    title: "🤖 Analyze with Agent Zero",
    contexts: ["selection"]
  })

  chrome.contextMenus.create({
    id: "explain-code",
    title: "💡 Explain this code",
    contexts: ["selection"]
  })

  chrome.contextMenus.create({
    id: "security-scan",
    title: "🔒 Security scan",
    contexts: ["selection"]
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return

  const config = await storage.get("config") as AgentZeroConfig

  switch (info.menuItemId) {
    case "analyze-code":
      await analyzeSelectedCode(tab.id, info.selectionText || "", config)
      break
    case "explain-code":
      await explainSelectedCode(tab.id, info.selectionText || "", config)
      break
    case "security-scan":
      await scanSelectedCode(tab.id, info.selectionText || "", config)
      break
  }
})

// Enable Side Panel on Action Click (Toolbar Icon)
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message)

  // Async handling wrapper
  const handleAsync = async () => {
    try {
      switch (message.type) {
        case "GET_CONFIG":
          return await handleGetConfig()
        case "UPDATE_CONFIG":
          return await handleUpdateConfig(message.config)
        case "TRIGGER_ANALYSIS":
          return await handleTriggerAnalysis(message.data)
        case "GET_MCS_SCORE":
          return await handleGetMCSScore(message.data)
        case "TRIGGER_AUTO_FIX":
          return await handleTriggerAutoFix(message.data)
        case "OPEN_SIDE_PANEL":
          if (sender.tab?.id) {
            // Attempt to open side panel
            try {
              await chrome.sidePanel.open({ tabId: sender.tab.id, windowId: sender.tab.windowId });
              return { success: true };
            } catch (err: any) {
              console.error("Failed to open side panel:", err);
              // Fallback: This usually means "User gesture required" or mismatch
              // We can't force it open without gesture.
              return { success: false, error: err.message || "Failed to open side panel" };
            }
          }
          return { success: false, error: "No tab ID" };
        case "CHECK_AUTH":
          return await handleCheckAuth()

        // New AI Handlers
        case "ANALYZE_CODE":
          return await handleAIRequest("analyze", message.code, message.model)
        case "EXPLAIN_CODE":
          return await handleAIRequest("explain", message.code, message.model)
        case "SECURITY_SCAN":
          return await handleAIRequest("scan", message.code, message.model)

        case "BROADCAST_MCS_DETAILS":
          if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              type: "SHOW_MCS_DETAILS",
              data: message.data
            });
            return { success: true };
          }
          return { success: false, error: "No tab ID" };

        default:
          console.warn("Unknown message type:", message.type)
          return { success: false, error: "Unknown message type" }
      }
    } catch (e) {
      return { success: false, error: (e as any).message }
    }
  }

  handleAsync().then(sendResponse);
  return true // Keep message channel open for async response
})

// Configuration handlers
async function handleGetConfig() {
  let config = await storage.get("config") as AgentZeroConfig
  if (!config) {
    config = defaultConfig
    await storage.set("config", defaultConfig)
  }
  return { success: true, config }
}

async function handleUpdateConfig(newConfig: Partial<AgentZeroConfig>) {
  const currentConfig = await storage.get("config") as AgentZeroConfig
  const updatedConfig = { ...currentConfig, ...newConfig }
  await storage.set("config", updatedConfig)
  return { success: true, config: updatedConfig }
}

// Unified AI Handler for Dashboard API
async function handleAIRequest(endpoint: "analyze" | "explain" | "scan", code: string, model: string) {
  try {
    const config = await storage.get("config") as AgentZeroConfig

    // Call Dashboard API
    const response = await fetch(`${config.dashboardUrl}/ai/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, model })
    })

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API failed (${response.status}): ${errText}`)
    }

    const data = await response.json()

    // Safe Data Normalization based on Endpoint
    let analysisResult: any = { code };

    if (endpoint === "explain") {
      analysisResult.summary = data.explanation ? "Explanation Ready" : "No explanation returned.";
      // Use the explanation as details (Markdown supported)
      analysisResult.details = data.explanation || "";
      analysisResult.risks = [];
    } else if (endpoint === "analyze") {
      analysisResult.summary = data.summary || "Analysis Complete";
      // If detailed issues exist, map them to strings for the 'risks' array
      analysisResult.risks = Array.isArray(data.issues)
        ? data.issues.map((i: any) => `${i.severity?.toUpperCase() || 'ISSUE'}: ${i.message}`)
        : [];
      analysisResult.details = `Score: ${data.score}/100\n\n${data.improvedCode ? "**Suggested Fix Available**" : ""}`;
    } else if (endpoint === "scan") {
      analysisResult.summary = data.summary || "Security Scan Complete";
      analysisResult.risks = Array.isArray(data.issues)
        ? data.issues.map((i: any) => `High Risk: ${i.message}`)
        : [];
      analysisResult.details = data.details || "No significant vulnerabilities found.";
    }

    await storage.set("lastAnalysis", analysisResult);

    // Save to History (Fire and Forget)
    fetch(`${config.dashboardUrl}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: "Unknown (Snippet)", // Ideally passed from content script
        file: "Snippet",
        type: endpoint,
        summary: analysisResult.summary || "AI Analysis"
      })
    }).catch(err => console.error("Failed to save history:", err));


    // Broadcast to Side Panel
    chrome.runtime.sendMessage({
      type: "SHOW_ANALYSIS_RESULT",
      data: analysisResult
    }).catch(() => {
      // Ignore errors if no listeners (side panel closed)
    });

    // Notify user of success
    if (config.enableNotifications) {
      const titleMap = { analyze: "Analysis Complete", explain: "Explanation Ready", scan: "Scan Complete" }
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon-48.png",
        title: `Agent Zero: ${titleMap[endpoint]}`,
        message: "Click to view results in the Side Panel."
      })
    }

    return { success: true, ...data }

  } catch (error) {
    console.error(`AI ${endpoint} failed:`, error)
    return { success: false, error: (error as any).message }
  }
}

// PR Workflow Handlers (Keep Kestra for workflows)
async function handleTriggerAnalysis(data: any) {
  const config = await storage.get("config") as AgentZeroConfig
  // Kestra call...
  const response = await fetch(`${config.kestraUrl}/api/v1/executions/webhook/com.agentzero/github-events/github-trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repository: { full_name: data.repository },
      sender: { login: "chrome-extension-user" },
      pull_request: data.pullRequest,
      trigger_source: "chrome_extension"
    })
  })

  if (!response.ok) throw new Error(`Kestra API failed: ${response.status}`)
  const result = await response.json()

  if (config.enableNotifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/icon-48.png",
      title: "Agent Zero Analysis Started",
      message: `Execution ID: ${result.id}`
    })
  }
  return { success: true, executionId: result.id }
}

async function handleGetMCSScore(data: any) {
  const config = await storage.get("config") as AgentZeroConfig

  // MCS is now a POST request with body
  const response = await fetch(`${config.dashboardUrl}/mcs-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data) // Pass the full data object (title, desc, stats)
  });

  if (!response.ok) throw new Error("Failed to fetch MCS score")
  const result = await response.json()
  return { success: true, mcsScore: result.score, status: result.status, reasoning: result.reasoning, risks: result.risks }
}

async function handleTriggerAutoFix(data: any) {
  const config = await storage.get("config") as AgentZeroConfig
  const response = await fetch(`${config.kestraUrl}/api/v1/executions/webhook/com.agentzero/auto-fix/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repository: data.repository,
      issue: data.issue,
      model: config.selectedModels.autoFix
    })
  })

  if (!response.ok) throw new Error("Auto-fix failed")
  const result = await response.json()
  return { success: true, executionId: result.id }
}

async function handleCheckAuth() {
  try {
    const config = await storage.get("config") as AgentZeroConfig;
    const response = await fetch(`${config.dashboardUrl}/auth/status`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, authenticated: data.authenticated, user: data.user };
    }
    return { success: false, error: "Auth check failed" };
  } catch (e) {
    return { success: false, error: "Auth check error" };
  }
}

// Context Menu Helpers
async function analyzeSelectedCode(tabId: number, selectedText: string, config: AgentZeroConfig) {
  chrome.tabs.sendMessage(tabId, {
    type: "ANALYZE_SELECTION",
    text: selectedText,
    model: config.selectedModels.codeAnalysis
  })
}

async function explainSelectedCode(tabId: number, selectedText: string, config: AgentZeroConfig) {
  chrome.tabs.sendMessage(tabId, {
    type: "EXPLAIN_SELECTION",
    text: selectedText,
    model: config.selectedModels.documentation
  })
}

async function scanSelectedCode(tabId: number, selectedText: string, config: AgentZeroConfig) {
  chrome.tabs.sendMessage(tabId, {
    type: "SECURITY_SCAN_SELECTION",
    text: selectedText,
    model: config.selectedModels.securityScan
  })
}

// Health Check
setInterval(async () => {
  const config = await storage.get("config") as AgentZeroConfig
  try {
    const response = await fetch(`${config.kestraUrl}/api/v1/health`)
    if (!response.ok) console.warn("Agent Zero backend health check failed")
  } catch (error) {
    // console.warn("Agent Zero backend unreachable") // Squelch log spam
  }
}, 60000)

export { }