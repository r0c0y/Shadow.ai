"use client";

import { ArrowRight, Bot, Code2, Shield, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-10 md:p-20 border border-white/10 group">
        {/* Animated Background Mesh */}
        <div className="absolute top-[-50%] right-[-20%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE: v2.4.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Autonomous</span> <br />
            Code Architect
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Orchestrate your development with Kestra pipelines and Cline agents.
            Automated analysis, security shielding, and self-healing repositories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/api/auth/signin" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 group">
              Dashboard Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-medium rounded-xl transition-all backdrop-blur-sm">
              View Kestra Flows
            </button>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)] pointer-events-none" />
      </section>


      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          {
            title: "Deep Analysis",
            desc: "Semantic understanding of code logic, not just syntax. Powered by Gemini Pro Vision.",
            icon: Code2,
            gradient: "from-blue-500/20 to-cyan-500/5",
            border: "group-hover:border-blue-500/30",
            iconColor: "text-blue-400",
            href: "/docs/concepts"
          },
          {
            title: "Security Shield",
            desc: "Real-time vulnerability detection matching NIST standards and OWASP Top 10.",
            icon: Shield,
            gradient: "from-red-500/20 to-orange-500/5",
            border: "group-hover:border-red-500/30",
            iconColor: "text-red-400",
            href: "/docs/security"
          },
          {
            title: "Auto-Remediation",
            desc: "Self-healing repositories that automatically generate fix PRs for detected issues.",
            icon: Zap,
            gradient: "from-amber-500/20 to-yellow-500/5",
            border: "group-hover:border-amber-500/30",
            iconColor: "text-amber-400",
            href: "/docs/cline"
          }
        ].map((feature, i) => (
          <Link key={i} href={feature.href} className={`glass-card p-1 rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/5 ${feature.border} transition-all duration-500 group hover:-translate-y-1 block`}>
            <div className="h-full bg-[#0A0A0A]/90 backdrop-blur-xl rounded-[22px] p-6 lg:p-8 flex flex-col pt-10 relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-4 opacity-50 bg-gradient-to-bl ${feature.gradient} rounded-bl-3xl`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>

              <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>

              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Live Activity & Documentation Split */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed (Mock) */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Live Activity</h3>
            </div>
            <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-1 rounded">REAL-TIME</span>
          </div>

          <div className="space-y-4 flex-1 overflow-hidden relative">
            {[
              { action: "Scan Completed", repo: "agent-zero/core", time: "2s ago", user: "system" },
              { action: "PR Analyzed", repo: "agent-zero/frontend", time: "45s ago", user: "priyanshu" },
              { action: "Vulnerability Found", repo: "agent-zero/api", time: "2m ago", user: "kestra-bot", alert: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                <Bot className="w-8 h-8 p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{item.action}</p>
                  <p className="text-xs text-zinc-500 truncate">{item.repo}</p>
                </div>
                <span className="text-[10px] text-zinc-600 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Documentation Quick Links */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">Documentation</h2>
              <p className="text-zinc-400 text-sm">Essential guides for Agent Zero integration.</p>
            </div>
            <Link href="/docs" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-4 py-2 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20">
              Full Docs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Quick Start Guide", desc: "5-minute setup flow", href: "/docs" },
              { label: "Kestra Integration", desc: "Orchestrate complex pipelines", href: "/docs/kestra" },
              { label: "Cline CLI Agent", desc: "Headless autonomous mode", href: "/docs/cline" },
              { label: "API Reference", desc: "Endpoints & Webhooks", href: "/docs/api" }
            ].map((item, i) => (
              <Link key={i} href={item.href} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-sm text-zinc-300 hover:text-white flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-zinc-500">{item.desc}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
