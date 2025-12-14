"use client";

import Sidebar from "@/components/Sidebar";
import { Activity, Server, Database, Shield, Zap } from "lucide-react";

export default function Diagnostics() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            <Sidebar />
            <main className="ml-64 p-8 lg:p-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">System Diagnostics</h1>
                    <p className="text-slate-400">Real-time infrastructure health.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-lg font-bold text-white">Docker Agent Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-400">Container ID</span>
                                <span className="font-mono text-emerald-400">agent-zero-capabilities</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                <span className="text-slate-400">User Identity</span>
                                <span className="font-mono text-yellow-400">uid:1001 (non-root)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Memory Usage</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[35%]"></div>
                                    </div>
                                    <span className="text-xs text-emerald-400">35%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-6 h-6 text-rose-400" />
                            <h3 className="text-lg font-bold text-white">Security Audits</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <span className="block text-2xl font-bold text-white mb-1">0</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Critical Vulns</span>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
                                <span className="block text-2xl font-bold text-emerald-400 mb-1">100%</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Compliance</span>
                            </div>
                            <div className="col-span-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm text-emerald-200">Network Isolation Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
