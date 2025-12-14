"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Book,
    Settings,
    Zap,
    Shield,
    Code2,
    Layers,
    Bot
} from "lucide-react";

export const navItems = [
    { name: "Overview", href: "/", icon: Home },
    { name: "Documentation", href: "/docs", icon: Book },
    { name: "Kestra Integration", href: "/docs/kestra", icon: Zap },
    { name: "Cline CLI", href: "/docs/cline", icon: Code2 },
    { name: "Architecture", href: "/docs/architecture", icon: Layers },
    // { name: "Security", href: "/docs/security", icon: Shield },
    // { name: "Agents", href: "/agents", icon: Bot },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-[#1a1a1a] z-50 hidden md:flex flex-col">
            {/* Logo Area */}
            <div className="p-6 border-b border-border/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight">Agent Zero</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Documentation</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Platform</h3>
                    {navItems.slice(0, 3).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">Technical</h3>
                    {navItems.slice(3).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User / Settings */}
            <div className="p-4 border-t border-border/10">
                <Link href="/profile" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                    Settings & Integrations
                </Link>
            </div>
        </aside>
    );
}
