
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Github, Play, ExternalLink, Code2, Bot, Zap, Shield, GitBranch } from "lucide-react";
import Link from "next/link";

export default function HackathonPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Hero Section */}
            <div className="text-center space-y-6 pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-4">
                    <Zap size={12} className="fill-current" />
                    Agent Zero • Hackathon Submission
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                    The Autonomous<br />Code Architect
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Agent Zero transforms GitHub into an agentic IDE. <br />
                    It actively listens, analyzes, and <span className="text-emerald-400 font-semibold">autonomously fixes</span> code using Kestra pipelines and Cline agents.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <a href="https://github.com/your-repo/agent-zero" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                        <Github size={20} />
                        View on GitHub
                    </a>
                    <a href="https://youtu.be/demo-video-link" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-[#FF0000]/10 text-[#FF0000] border border-[#FF0000]/20 font-semibold rounded-full hover:bg-[#FF0000]/20 transition-colors">
                        <Play size={20} className="fill-current" />
                        Watch Demo
                    </a>
                </div>
            </div>

            {/* The "Why" Section - Problem/Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card className="bg-[#0A0A0A] border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="text-gray-200">The Problem</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-400">
                        Code reviews are passive. CI/CD finds bugs, but doesn't fix them. Developers spend hours context-switching between GitHub, their IDE, and security tools just to understand a single PR.
                    </CardContent>
                </Card>
                <Card className="bg-[#0A0A0A] border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="text-emerald-400">The Solution</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-400">
                        Agent Zero lives <strong>inside</strong> GitHub via a Chrome Extension. It injects a "Merge Candidate Score" (MCS) into every PR and creates a bridge to autonomous agents (Cline) that can actually commit fixes back to the repo.
                    </CardContent>
                </Card>
            </div>

            {/* Architecture Diagram */}
            <div className="max-w-5xl mx-auto">
                <div className="p-8 border border-white/10 rounded-2xl bg-black/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black/0 to-black/0" />
                    <h3 className="text-2xl font-bold text-center mb-8 relative z-10">System Architecture</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 font-mono text-sm">
                        <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 text-center w-48">
                            <div className="text-emerald-400 mb-2 font-bold">Extension</div>
                            <div className="text-gray-500 text-xs">React + SidePanel</div>
                        </div>
                        <div className="hidden md:block text-gray-600">◄───►</div>
                        <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 text-center w-48 animate-pulse border-emerald-500/30">
                            <div className="text-blue-400 mb-2 font-bold">Kestra</div>
                            <div className="text-gray-500 text-xs">Orchestration Engine</div>
                        </div>
                        <div className="hidden md:block text-gray-600">◄───►</div>
                        <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/10 text-center w-48">
                            <div className="text-purple-400 mb-2 font-bold">Cline</div>
                            <div className="text-gray-500 text-xs">Autonomous Agent</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sponsor Tracks */}
            <div className="max-w-6xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold text-center">Hackathon Tracks</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-[#0A0A0A] border-purple-500/20 hover:border-purple-500/50 transition-colors">
                        <CardHeader>
                            <div className="mb-4 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Code2 size={24} />
                            </div>
                            <CardTitle>Infinity Build (Cline)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            We use Cline as our "Worker Agent". When a user requests an "Auto-Fix", Agent Zero spins up a Cline instance to perform the refactor and verification sandbox before pushing code.
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-blue-500/20 hover:border-blue-500/50 transition-colors">
                        <CardHeader>
                            <div className="mb-4 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Bot size={24} />
                            </div>
                            <CardTitle>Wakanda Data (Kestra)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Kestra is the central nervous system. It orchestrates the flow between the Extension, the AI Analyzers (Gemini/Groq), and the CLI Agents, handling state and retries.
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-white/10 hover:border-white/30 transition-colors">
                        <CardHeader>
                            <div className="mb-4 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                <Zap size={24} />
                            </div>
                            <CardTitle>Stormbreaker (Vercel)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400">
                            Deployed on Vercel for instant global scale. Our Next.js API Routes act as the secure gateway between the browser extension and our backend infrastructure.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <Card className="bg-[#0A0A0A] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">How does Agent Zero orchestrate tasks?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm">
                            We use <span className="text-purple-400 font-semibold">Kestra</span> as our central nervous system. When the Chrome Extension or GitHub Webhook triggers an event, Kestra spins up parallel workflows to run security scans (SAST) and logic analysis (Gemini) simultaneously. If issues are found, it dispatches a <Link href="/docs/cline" className="text-blue-400 underline">Cline</Link> agent to fix them autonomously.
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">What makes this "Autonomous" vs just "Automated"?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm">
                            Automation follows a script. Autonomy makes decisions. Agent Zero analyzes the <i>intent</i> of a PR (e.g. "Refactor this class") and decides <i>how</i> to implement it using Cline's reasoning capabilities, verifying its own work in a sandbox before showing it to you.
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">Is my code safe?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm">
                            Yes. Agent Zero runs locally or in your private cloud (Vercel/Docker). We use Google's Gemini Pro API which is enterprise-grade, and our "Ghost Mode" ensures the extension only reads what you explicitly select.
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0A0A] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg">How do I deploy this myself?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-400 text-sm">
                            It's fully containerized! Just run <code>docker-compose up</code> to spin up the Dashboard, Database, and Kestra orchestrator. See our <Link href="/docs" className="text-emerald-400 underline">Documentation</Link> for details.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-20 text-gray-500 text-sm">
                Built with ❤️ for the Hackathon by Team Agent Zero.
            </div>
        </div>
    );
}
