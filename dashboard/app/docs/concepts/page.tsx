
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, Ghost, ShieldCheck } from "lucide-react";

export default function ConceptsDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Core Concepts</h1>
                <p className="text-gray-400 text-lg">
                    Understanding the unique features that make Agent Zero powerful.
                </p>
            </div>

            <div className="space-y-8">

                {/* MCS Badge */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-emerald-400" size={28} />
                        <h2 className="text-2xl font-semibold text-emerald-400">MCS Badge (Merge Candidate Score)</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        The content script injects a dynamic badge into every Pull Request header. This isn't just a number—it's a real-time confidence metric derived from semantic analysis of your code changes, deletions, and complexity.
                    </p>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Scoring Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <div className="text-2xl font-bold text-emerald-400">80-100</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide">Merge Candidate</div>
                            </div>
                            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <div className="text-2xl font-bold text-amber-400">50-79</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide">Needs Review</div>
                            </div>
                            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                <div className="text-2xl font-bold text-red-400">0-49</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide">High Risk</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Ghost Mode */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Ghost className="text-purple-400" size={28} />
                        <h2 className="text-2xl font-semibold text-purple-400">Ghost Mode</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        We believe tools should be invisible until needed. Ghost Mode is our "Zero UI" philosophy. When enabled, Agent Zero hides all floating buttons and overlays. It only reveals itself when you explicitly select code and pause, or use the keyboard shortcut (`Cmd+E`), ensuring a distraction-free reading experience on GitHub.
                    </p>
                </section>

                {/* Distributed Agents */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Bot className="text-blue-400" size={28} />
                        <h2 className="text-2xl font-semibold text-blue-400">Agentic Architecture</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                        Agent Zero is not a single bot. It's a swarm of specialized agents:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4">
                        <li><strong>Watcher Agent (Chrome Ext):</strong> Observes DOM changes and user intent.</li>
                        <li><strong>Orchestrator (Kestra):</strong> Manages state, retries, and integrations.</li>
                        <li><strong>Worker Agent (Cline):</strong> Executes shell commands and file edits in a sandbox.</li>
                    </ul>
                </section>

            </div>
        </div>
    );
}
