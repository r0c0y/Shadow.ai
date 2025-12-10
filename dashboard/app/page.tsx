
"use client";

import Sidebar from "@/components/Sidebar";
import MCSCard from "@/components/MCSCard";
import { GitPullRequest, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">

      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Overview of repository health and agent activities.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </span>
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-1 h-full">
            <MCSCard score={97} />
          </div>

          {/* Simple Stat Cards */}
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between h-auto min-h-[150px]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-800 rounded-lg">
                <GitPullRequest className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-green-500 flex items-center text-xs font-medium bg-green-500/10 px-2 py-1 rounded">+12%</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">24</h3>
              <p className="text-sm text-slate-500">Active Pull Requests</p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between h-auto min-h-[150px]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-800 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">98.5%</h3>
              <p className="text-sm text-slate-500">Build Success Rate</p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between h-auto min-h-[150px]">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-slate-800 rounded-lg">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">1.2m</h3>
              <p className="text-sm text-slate-500">Avg. Repair Time</p>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((item, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors rounded-lg px-2 -mx-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Autonomous Fix Applied</h4>
                    <p className="text-xs text-slate-500 mt-1">Agent Zero updated dependencies in <span className="font-mono text-slate-400">agent-zero/demo-repo</span></p>
                  </div>
                  <span className="ml-auto text-xs text-slate-600">2m ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Panel */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Deployment Status</h3>
            {/* Placeholder for timeline or other widgets */}
            <div className="space-y-6 relative ml-2">
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-800 ml-[5px]"></div>

              {[
                { label: "Production", status: "Live", color: "bg-emerald-500" },
                { label: "Staging", status: "Building", color: "bg-amber-500" },
                { label: "Canary", status: "Standby", color: "bg-slate-500" },
              ].map((env, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 z-10 ring-4 ring-slate-900 ${env.color}`} />
                  <div>
                    <h4 className="text-sm font-medium text-slate-300">{env.label}</h4>
                    <span className="text-xs text-slate-500">{env.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
