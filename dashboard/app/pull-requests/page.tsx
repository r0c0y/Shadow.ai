"use client";

import Sidebar from "@/components/Sidebar";
import { GitPullRequest, ExternalLink, GitCommit, CheckCircle, XCircle, Clock } from "lucide-react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PullRequests() {
    const { data: executions, error } = useSWR('/api/kestra/executions', fetcher, { refreshInterval: 5000 });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            <Sidebar />
            <main className="ml-64 p-8 lg:p-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Pull Requests & Fixes</h1>
                    <p className="text-slate-400">History of autonomous agent interventions.</p>
                </header>

                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-slate-400 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Execution ID</th>
                                    <th className="px-6 py-4">Trigger</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">MCS Score</th>
                                    <th className="px-6 py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {executions && executions.map((exec: any) => {
                                    const mcs = exec.outputs?.calculate_mcs?.vars?.mcs || "N/A";
                                    const status = exec.state.current;
                                    const color = status === 'SUCCESS' ? 'text-emerald-400' : status === 'FAILED' ? 'text-rose-400' : 'text-blue-400';

                                    return (
                                        <tr key={exec.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-300">{exec.id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <GitCommit className="w-4 h-4 text-slate-500" />
                                                    {exec.trigger?.variables?.body?.sender?.login || "System"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-opacity-10 ${status === 'SUCCESS' ? 'bg-emerald-500 text-emerald-400' : status === 'FAILED' ? 'bg-rose-500 text-rose-400' : 'bg-slate-500 text-slate-300'}`}>
                                                    {status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                                                    {status === 'FAILED' && <XCircle className="w-3 h-3" />}
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {mcs !== "N/A" ? <span className={mcs > 80 ? "text-emerald-400" : "text-amber-400"}>{mcs}</span> : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(exec.state.startDate).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {!executions && !error && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading history...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
