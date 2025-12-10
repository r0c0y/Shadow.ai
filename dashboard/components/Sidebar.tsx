
"use client";

import { ShieldCheck, LayoutDashboard, GitPullRequest, Settings, Terminal, Activity } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="p-2 bg-rose-600 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg tracking-wide text-white">AGENT ZERO</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 bg-rose-600/10 text-rose-500 rounded-lg font-medium transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                    <Activity className="w-5 h-5" />
                    Diagnostics
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                    <GitPullRequest className="w-5 h-5" />
                    Pull Requests
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                    <Terminal className="w-5 h-5" />
                    Logs
                </a>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
                    <Settings className="w-5 h-5" />
                    Settings
                </a>
            </div>
        </aside>
    );
}
