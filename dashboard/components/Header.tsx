"use client";

import React from "react";
import { Search, Command, Bell } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
    return (
        <header className="h-16 border-b border-border/10 backdrop-blur-xl bg-black/20 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8">
            <MobileMenu />

            {/* Search Bar */}
            <div className="flex-1 max-w-xl ml-2 md:ml-0">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-white/5 rounded-lg leading-5 bg-white/5 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-all duration-200"
                        placeholder="Search documentation..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-zinc-600 text-xs border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black"></span>
                </button>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-zinc-200">Admin User</div>
                        <div className="text-xs text-zinc-500">Workspace Owner</div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 border border-white/10"></div>
                </div>
            </div>
        </header>
    );
}
