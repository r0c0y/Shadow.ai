// Options page for Agent Zero Chrome Extension
// Advanced configuration and team management

import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import {
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Users,
  Zap,
  Shield,
  BarChart3,
  ExternalLink
} from "lucide-react"

// Chrome storage wrapper
const storage = {
  async get(key: string) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },
  async set(key: string, value: any) {
    await chrome.storage.local.set({ [key]: value });
  },
  async clear() {
    await chrome.storage.local.clear();
  }
};

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
  teamSettings?: {
    teamId?: string
    role?: "admin" | "member" | "viewer"
    sharedConfigs?: boolean
  }
  advancedSettings?: {
    maxConcurrentAnalyses?: number
    timeoutSeconds?: number
    retryAttempts?: number
    enableDebugMode?: boolean
  }
}

const AgentZeroOptions: React.FC = () => {
  const [config, setConfig] = useState<AgentZeroConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"general" | "models" | "team" | "advanced">("general")

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const storedConfig = await storage.get("config")
      if (storedConfig) {
        setConfig(storedConfig)
      }
    } catch (err) {
      setError("Failed to load configuration")
    }
  }

  const saveConfig = async () => {
    if (!config) return

    setSaving(true)
    setError(null)

    try {
      await storage.set("config", config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError("Failed to save configuration")
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (updates: Partial<AgentZeroConfig>) => {
    setConfig(prev => prev ? { ...prev, ...updates } : null)
  }

  const testConnection = async (url: string, type: "kestra" | "dashboard") => {
    try {
      const endpoint = type === "kestra" ? "/api/v1/health" : "/api/health"
      const response = await fetch(url + endpoint)

      if (response.ok) {
        alert(`✅ ${type} connection successful!`)
      } else {
        alert(`❌ ${type} connection failed: ${response.status}`)
      }
    } catch (error) {
      alert(`❌ ${type} connection failed: ${(error as any).message}`)
    }
  }

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      const defaultConfig: AgentZeroConfig = {
        kestraUrl: "http://localhost:8080",
        dashboardUrl: "http://localhost:3000",
        enableNotifications: true,
        selectedModels: {
          codeAnalysis: "gemini-pro",
          securityScan: "gemini-pro",
          autoFix: "cline",
          documentation: "claude-3.5"
        },
        advancedSettings: {
          maxConcurrentAnalyses: 3,
          timeoutSeconds: 300,
          retryAttempts: 2,
          enableDebugMode: false
        }
      }
      setConfig(defaultConfig)
    }
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Zero Settings</h1>
                <p className="text-gray-600">Configure your AI development assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Settings saved!</span>
                </div>
              )}

              <button
                onClick={saveConfig}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {[
                { id: "general", label: "General", icon: Settings },
                { id: "models", label: "AI Models", icon: Zap },
                { id: "team", label: "Team", icon: Users },
                { id: "advanced", label: "Advanced", icon: BarChart3 }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === section.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-white rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => chrome.tabs.create({ url: config.dashboardUrl })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Dashboard
                </button>
                <button
                  onClick={resetToDefaults}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border p-6">
              {activeSection === "general" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kestra Backend URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={config.kestraUrl}
                          onChange={(e) => updateConfig({ kestraUrl: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="http://localhost:8080"
                        />
                        <button
                          onClick={() => testConnection(config.kestraUrl, "kestra")}
                          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          Test
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        URL of your Kestra orchestration server
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dashboard URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={config.dashboardUrl}
                          onChange={(e) => updateConfig({ dashboardUrl: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="http://localhost:3000"
                        />
                        <button
                          onClick={() => testConnection(config.dashboardUrl, "dashboard")}
                          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          Test
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        URL of your Agent Zero dashboard
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value={config.apiKey || ""}
                      onChange={(e) => updateConfig({ apiKey: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter API key for authenticated access"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Required for team features and advanced analytics
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.enableNotifications}
                        onChange={(e) => updateConfig({ enableNotifications: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enable browser notifications
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Get notified when analyses complete or issues are found
                    </p>
                  </div>
                </div>
              )}

              {activeSection === "models" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Model Configuration</h2>
                    <p className="text-gray-600">
                      Choose the best AI model for each type of task. Different models excel at different capabilities.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(config.selectedModels).map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <select
                          value={value}
                          onChange={(e) => updateConfig({
                            selectedModels: { ...config.selectedModels, [key]: e.target.value }
                          })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <optgroup label="Cloud Models">
                            <option value="gpt-4">GPT-4 (OpenAI)</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</option>
                            <option value="claude-3.5">Claude 3.5 Sonnet (Anthropic)</option>
                            <option value="claude-3-haiku">Claude 3 Haiku (Anthropic)</option>
                            <option value="gemini-pro">Gemini Pro (Google)</option>
                            <option value="gemini-flash">Gemini Flash (Google)</option>
                          </optgroup>
                          <optgroup label="Specialized">
                            <option value="cline">Cline CLI (Code Fixes)</option>
                            <option value="coderabbit">CodeRabbit (Reviews)</option>
                          </optgroup>
                          <optgroup label="Local Models">
                            <option value="ollama-codellama">Code Llama (Ollama)</option>
                            <option value="ollama-deepseek">DeepSeek Coder (Ollama)</option>
                          </optgroup>
                        </select>
                        <div className="mt-2 text-xs text-gray-500">
                          {key === "codeAnalysis" && "Best for understanding code structure and complexity"}
                          {key === "securityScan" && "Specialized in finding vulnerabilities and security issues"}
                          {key === "autoFix" && "Capable of making autonomous code changes"}
                          {key === "documentation" && "Excellent at writing clear explanations and docs"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">💡 Model Recommendations</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>GPT-4:</strong> Best overall performance, higher cost</li>
                      <li>• <strong>Claude 3.5:</strong> Excellent for documentation and explanations</li>
                      <li>• <strong>Gemini Pro:</strong> Great balance of speed and accuracy</li>
                      <li>• <strong>Cline:</strong> Specialized for autonomous code fixes</li>
                      <li>• <strong>Local models:</strong> Privacy-focused, no API costs</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === "team" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Settings</h2>
                    <p className="text-gray-600">
                      Configure team collaboration and shared settings.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Team Features Coming Soon</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Team collaboration features are currently in development.
                      Sign up for early access to be notified when they're available.
                    </p>
                  </div>

                  <div className="space-y-4 opacity-50">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team ID
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                        placeholder="Enter your team ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Role
                      </label>
                      <select disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                        <option>Admin</option>
                        <option>Member</option>
                        <option>Viewer</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          disabled
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Share configurations with team
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "advanced" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Settings</h2>
                    <p className="text-gray-600">
                      Fine-tune performance and behavior settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Concurrent Analyses
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.advancedSettings?.maxConcurrentAnalyses || 3}
                        onChange={(e) => updateConfig({
                          advancedSettings: {
                            ...config.advancedSettings,
                            maxConcurrentAnalyses: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of analyses that can run simultaneously
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="600"
                        value={config.advancedSettings?.timeoutSeconds || 300}
                        onChange={(e) => updateConfig({
                          advancedSettings: {
                            ...config.advancedSettings,
                            timeoutSeconds: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum time to wait for analysis completion
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retry Attempts
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={config.advancedSettings?.retryAttempts || 2}
                        onChange={(e) => updateConfig({
                          advancedSettings: {
                            ...config.advancedSettings,
                            retryAttempts: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Number of times to retry failed analyses
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.advancedSettings?.enableDebugMode || false}
                        onChange={(e) => updateConfig({
                          advancedSettings: {
                            ...config.advancedSettings,
                            enableDebugMode: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enable debug mode
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      Show detailed logs and debugging information in console
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">⚠️ Danger Zone</h3>
                    <p className="text-sm text-red-800 mb-3">
                      These actions cannot be undone. Proceed with caution.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm("This will clear all stored data including settings, cache, and history. Are you sure?")) {
                          storage.clear()
                          alert("All data cleared. Please refresh the page.")
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mount the React app
const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<AgentZeroOptions />);
}