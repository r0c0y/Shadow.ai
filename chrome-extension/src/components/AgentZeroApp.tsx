
import React, { useState, useEffect } from "react"
import {
    Settings,
    Zap,
    Shield,
    Code,
    FileText,
    Activity,
    ExternalLink,
    RefreshCw,
    ChevronRight,
    ChevronLeft,
    Github,
    Gitlab,
    CheckCircle,
    AlertTriangle,
    Bot,
    ChevronDown,
    Slack,
    Play,
    Lock
} from "lucide-react"

// Chrome storage and messaging wrappers
const storage = {
    async get(key: string) {
        const result = await chrome.storage.local.get(key);
        return result[key];
    },
    async set(key: string, value: any) {
        await chrome.storage.local.set({ [key]: value });
    }
};

const sendToBackground = async (message: any): Promise<any> => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, resolve);
    });
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
}

interface RepoContext {
    name: string
    platform: "github" | "gitlab"
    file?: string
    branch?: string
    language?: string
}

interface AnalysisResult {
    summary: string
    details: string
    risks: string[]
    code?: string
}

export const AgentZeroApp: React.FC = () => {
    // State
    const [config, setConfig] = useState<AgentZeroConfig | null>(null)
    const [context, setContext] = useState<RepoContext | null>(null)
    const [onboardingStep, setOnboardingStep] = useState<number>(0) // 0=None, 1=Welcome, 2=GhostMode
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [view, setView] = useState<"onboarding" | "main" | "auth">("main")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Analyzing intent...")

    const [activeTab, setActiveTab] = useState<"home" | "actions" | "settings">("home");

    // Derived State
    const isFirstTime = onboardingStep === 1;

    useEffect(() => {
        initialize();
        setupListeners();
    }, [])

    // --- ACTIONS ---

    const setupListeners = () => {
        // Listen for "Analyze" triggers from Content Script logic
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === "SHOW_ANALYSIS_RESULT") {
                setAnalysisResult(message.data);
                setLoading(false);
                setView("main");
                setActiveTab("home");
            } else if (message.type === "SHOW_MCS_DETAILS") {
                // Normalize MCS data to AnalysisResult format
                setAnalysisResult({
                    summary: `MCS Score: ${message.data.score} (${message.data.status})`,
                    details: message.data.reasoning || "No detailed reasoning provided for this score.",
                    risks: message.data.risks || ["Low complexity", "Standard changes"]
                });
                setLoading(false);
                setView("main");
                setActiveTab("home");
            }
        });
    };

    const detectContext = async () => {
        // Basic detection logic (enhanced later via content script messages)
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
            const url = new URL(tab.url);
            if (url.hostname === "github.com") {
                const parts = url.pathname.split("/").filter(Boolean);
                setContext({
                    name: `${parts[0]}/${parts[1] || ""}`,
                    platform: "github",
                    branch: "main", // Placeholder, content script updates this
                    language: "TypeScript" // Placeholder
                });
            }
        }
    }

    const startGhostMode = () => {
        setOnboardingStep(2);
        setView("main"); // Hide welcome card, but effectively in ghost mode
        // Signal content script to dim page
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "START_GHOST_MODE" });
            }
        });
    }

    const handleAuth = async () => {
        // Real Auth Flow
        const btn = document.getElementById("auth-btn") as HTMLButtonElement | null;
        if (btn) {
            btn.innerText = "Connecting...";
            btn.disabled = true;
        }

        // Open Dashboard Sign In
        window.open(`${config?.dashboardUrl || "http://localhost:3000"}/api/auth/signin`, "_blank");

        // Poll for success
        const poll = setInterval(async () => {
            const response = await sendToBackground({ type: "CHECK_AUTH" });
            if (response.authenticated) {
                clearInterval(poll);
                await storage.set("hasAuth", true);
                await storage.set("user", response.user);
                setIsAuthenticated(true);
                setView("main");
                setActiveTab("home");
            }
        }, 2000);
    }

    const triggerExplanation = async (type: "explain" | "diff" | "security") => {
        if (!isAuthenticated) {
            setView("auth");
            return;
        }

        setLoading(true);
        setLoadingMessage(type === "diff" ? "Analyzing changes..." : "Analyzing intent...");
        setAnalysisResult(null); // Clear previous result while loading

        // Signal content script to grab selection and send to backend
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_EXPLANATION", mode: type });
        }
    }

    const clearAnalysis = async () => {
        setAnalysisResult(null);
        await storage.set("lastAnalysis", null);
    }

    const initialize = async () => {
        // Load Config
        const storedConfig = await storage.get("config");
        setConfig(storedConfig || {
            kestraUrl: "http://localhost:8080",
            dashboardUrl: "http://localhost:3000",
            enableNotifications: true,
            selectedModels: { codeAnalysis: "gemini-pro", securityScan: "gemini-pro", autoFix: "cline", documentation: "claude-3.5" }
        });

        // Load Last Analysis
        const lastAnalysis = await storage.get("lastAnalysis");
        if (lastAnalysis) {
            setAnalysisResult(lastAnalysis);
        }

        // Check Onboarding Status
        const hasOnboarded = await storage.get("hasOnboarded");
        if (!hasOnboarded) {
            setOnboardingStep(1);
            setView("onboarding");
        } else {
            // Check Auth (Real Sync)
            const authCheck = await sendToBackground({ type: "CHECK_AUTH" });
            if (authCheck.authenticated) {
                setIsAuthenticated(true);
                setView("main");
                await storage.set("hasAuth", true);
            } else {
                // Fallback to local storage if API fails (offline mode?)
                const hasAuth = await storage.get("hasAuth");
                setIsAuthenticated(!!hasAuth);
                setView(hasAuth ? "main" : "onboarding");
            }

            detectContext();
        }
    }

    // --- VIEW COMPONENTS ---

    interface NavItemProps {
        icon: React.ElementType;
        id: "home" | "actions" | "settings";
        tooltip: string;
    }

    const NavItem: React.FC<NavItemProps> = ({ icon: Icon, id, tooltip }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`relative p-2 rounded-lg transition-all group ${activeTab === id ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
        >
            <Icon size={18} />
            {/* Tooltip */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                {tooltip}
            </div>
        </button>
    );

    const TopBar = () => (
        <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 pb-0 flex flex-col gap-3">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={chrome.runtime.getURL("assets/logo-new.png")} className="w-6 h-6 rounded-md" alt="Agent Zero" />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-300 truncate max-w-[150px]">
                            {context?.name || "Agent Zero"}
                        </span>
                        {context?.file && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] text-gray-500 font-mono">{context.file}</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Clear Analysis Action (only on Home) */}
                {activeTab === "home" && analysisResult && (
                    <button onClick={clearAnalysis} className="text-gray-600 hover:text-red-400 transition-colors" title="Clear Context">
                        <RefreshCw size={14} />
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-around pb-2">
                <NavItem icon={Code} id="home" tooltip="Context & Analysis" />
                <NavItem icon={Zap} id="actions" tooltip="Quick Actions" />
                <NavItem icon={Settings} id="settings" tooltip="Configuration" />
            </div>
        </div>
    );

    const OnboardingView = () => (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <img src={chrome.runtime.getURL("assets/logo-new.png")} className="w-12 h-12 mb-6 rounded-xl shadow-lg shadow-emerald-500/20" />
            <h2 className="text-lg font-bold text-white mb-2">Explain code directly on GitHub.</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-[240px]">Select code → get clarity. No bots. No clutter.</p>

            <button
                onClick={startGhostMode}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-emerald-500/25 mb-3"
            >
                Try it on this page
            </button>
            <button
                onClick={() => { storage.set("hasOnboarded", true); setView("main"); }}
                className="text-xs text-gray-600 hover:text-gray-400"
            >
                Skip onboarding
            </button>
        </div>
    );

    const AuthView = () => (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Lock size={20} className="text-emerald-500" />
            </div>

            <h2 className="text-lg font-bold text-white mb-2">Sign in to explain code</h2>
            <div className="bg-white/5 rounded-lg p-3 w-full text-left mb-6">
                <p className="text-xs text-gray-400 mb-2">We only read:</p>
                <ul className="space-y-1 text-xs text-gray-300">
                    <li className="flex items-center gap-2"><CheckCircle size={10} className="text-emerald-500" /> Public profile</li>
                    <li className="flex items-center gap-2"><CheckCircle size={10} className="text-emerald-500" /> Repository metadata</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">We never write to your repos.</p>
            </div>

            <button
                onClick={handleAuth}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#24292e] hover:bg-[#2f363d] text-white text-sm font-medium rounded-lg transition-all border border-white/10"
            >
                <Github size={16} />
                Continue with GitHub
            </button>
        </div>
    );

    const ActionsView = () => (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors cursor-pointer group" onClick={() => triggerExplanation("security")}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                        <Shield size={20} />
                    </div>
                    <h3 className="font-medium text-gray-200">Security Audit</h3>
                </div>
                <p className="text-xs text-gray-500">Scan current file for vulnerabilities and risky patterns.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer group" onClick={() => triggerExplanation("diff")}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                        <Gitlab size={20} />
                    </div>
                    <h3 className="font-medium text-gray-200">Explain PR Diff</h3>
                </div>
                <p className="text-xs text-gray-500">Analyze changes in this Pull Request for bugs and logic errors.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                    </div>
                    <h3 className="font-medium text-gray-200">Generate Docstring</h3>
                </div>
                <p className="text-xs text-gray-500">Auto-generate documentation for the selected function or class.</p>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">AI Models</h3>
                <div className="bg-white/5 rounded-lg p-3 space-y-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-400">Analysis Model</label>
                        <select className="bg-black/50 border border-white/10 rounded p-2 text-xs text-white outline-none focus:border-emerald-500">
                            <option>Gemini Pro (Flash)</option>
                            <option>GPT-4o</option>
                            <option>Claude 3.5 Sonnet</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Status</h3>
                <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Dashboard API</span>
                        <div className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Connected
                        </div>
                    </div>
                    <a href={config?.kestraUrl || "http://localhost:8080"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-xs group hover:bg-white/5 p-1 -mx-1 rounded transition-colors">
                        <span className="text-gray-300 group-hover:text-white">Kestra Orchestration</span>
                        <div className="flex items-center gap-1.5 text-blue-400">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Active <ChevronLeft size={10} className="rotate-180" />
                        </div>
                    </a>
                    <div className="flex items-center justify-between text-xs p-1 -mx-1">
                        <span className="text-gray-300">Cline CLI</span>
                        <div className="flex items-center gap-1.5 text-purple-400">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                            Ready
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preferences</h3>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Ghost Mode</span>
                    <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative cursor-pointer" onClick={() => { /* Toggle logic */ }}>
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Integrations</h3>

                <div className="bg-white/5 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                            <Slack size={14} className="text-[#E01E5A]" />
                            <span>Slack Alerts</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                            Managed via Dashboard
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="p-0.5 bg-blue-500/10 rounded text-blue-400">@</div>
                            <span>Email Digest</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                            Managed via Dashboard
                        </span>
                    </div>

                    <button
                        onClick={() => window.open(`${config?.dashboardUrl || "http://localhost:3000"}/profile`, "_blank")}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings size={12} />
                        Configure Integrations
                    </button>

                    <p className="text-[10px] text-gray-600 text-center">
                        All notification preferences are synced from your Agent Zero profile.
                    </p>
                </div>
            </div>
        </div>
    );

    const MainView = () => (
        <div className="flex flex-col h-full">
            <TopBar />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === "actions" && <ActionsView />}
                {activeTab === "settings" && <SettingsView />}

                {activeTab === "home" && (
                    <div className="p-4 space-y-4">
                        {/* Empty State / Ghost Mode Waiting */}
                        {!analysisResult && !loading && (
                            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500 mt-10 border-2 border-dashed border-white/5 rounded-xl">
                                <Code size={24} className="mb-2 opacity-50" />
                                <p className="text-sm">Select code on GitHub to begin</p>
                                {onboardingStep === 2 && (
                                    <p className="text-xs text-emerald-500 mt-2 animate-pulse">Waiting for selection...</p>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center h-48 space-y-3 animate-in fade-in">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">{loadingMessage}</p>
                            </div>
                        )}

                        {/* Analysis Result */}
                        {analysisResult && !loading && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                {/* Summary Section */}
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">What this does</h3>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <p className="text-sm text-gray-200 leading-relaxed font-medium">
                                            {analysisResult.summary}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">How it works</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {analysisResult.details}
                                    </p>
                                </div>

                                {/* Risks Section */}
                                {analysisResult.risks && analysisResult.risks.length > 0 && (
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                            <AlertTriangle size={12} /> Failure Modes
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {analysisResult.risks.map((risk, i) => (
                                                <li key={i} className="text-xs text-red-200/80 flex items-start gap-2">
                                                    <span className="mt-1 w-1 h-1 bg-red-400 rounded-full shrink-0"></span>
                                                    {risk}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Actions Footer */}
                                <div className="pt-4 mt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                                    <button className="flex items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                                        <Zap size={12} /> Simplify
                                    </button>
                                    <button className="flex items-center justify-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors">
                                        <FileText size={12} /> Generate Tests
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hint Footer - Only Show on Home */}
            {activeTab === "home" && !loading && (
                <div className="p-3 border-t border-white/5 bg-[#050505]">
                    <div className="text-[10px] text-gray-600 flex justify-between">
                        <span>Press <kbd className="bg-white/10 px-1 rounded text-gray-400">⌘ E</kbd> to explain</span>
                        {context?.platform === "github" && (
                            <button onClick={() => triggerExplanation("diff")} className="hover:text-emerald-500 transition-colors">Explain Diff</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="w-full h-full bg-[#000000] text-white font-sans overflow-hidden flex flex-col relative">
            {/* Global Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            {view === "onboarding" && <OnboardingView />}
            {view === "auth" && <AuthView />}
            {view === "main" && <MainView />}
        </div>
    )
}
