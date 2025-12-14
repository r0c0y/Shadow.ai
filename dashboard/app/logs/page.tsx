"use client";

import Sidebar from "@/components/Sidebar";
import { Terminal, RefreshCw } from "lucide-react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Logs() {
    const { data, mutate, isValidating } = useSWR('/api/kestra/logs', fetcher);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            <Sidebar />
            <main className="ml-64 p-8 lg:p-12 h-screen flex flex-col">
                <header className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
                        <p className="text-slate-400">Live stream from Docker Agent Container.</p>
                    </div>
                    <button
                        onClick={() => mutate()}
                        className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                        title="Refresh Logs"
                    >
                        <RefreshCw className={`w-5 h-5 text-slate-400 ${isValidating ? 'animate-spin' : ''}`} />
                    </button>
                </header>

                <div className="flex-1 bg-black rounded-xl border border-slate-800 p-6 overflow-hidden flex flex-col font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-900">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-500">agent-zero@kestra:~/flows $ tail -f execution.log</span>
                        {data?.executionId && <span className="ml-auto text-xs text-slate-600">ID: {data.executionId}</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                        {data?.logs?.map((line: string, i: number) => (
                            <div key={i} className="text-slate-300 break-words hover:bg-slate-900/50">
                                {line}
                            </div>
                        ))}
                        {!data && <div className="text-slate-500 animate-pulse">Connecting to Agent Stream...</div>}
                    </div>
                </div>
            </main>
        </div>
    );
}
