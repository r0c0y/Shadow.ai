"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot, Settings } from "lucide-react";
import { navItems } from "./Sidebar";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Side Drawer */}
            <div
                className={`fixed top-0 left-0 w-72 h-full bg-[#09090b] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-emerald-500" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">Agent Zero</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

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

                    <div className="p-4 border-t border-white/10">
                        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all">
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
