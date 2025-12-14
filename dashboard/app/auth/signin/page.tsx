"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleLogin = (provider: string) => {
        setIsLoading(provider);
        signIn(provider, { callbackUrl: "/profile" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black selection:bg-emerald-500/30 selection:text-emerald-200 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <span className="text-3xl">🤖</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-400">Sign in to access your Agent Zero dashboard</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">

                    {/* GitHub Login (Primary) */}
                    <button
                        onClick={() => handleLogin('github')}
                        disabled={!!isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white p-4 rounded-xl font-medium transition-all transform active:scale-[0.98] disabled:opacity-70 group relative overflow-hidden"
                    >
                        {isLoading === 'github' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Github className="w-5 h-5" />
                                <span>Sign in with GitHub</span>
                                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
                            </>
                        )}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-zinc-500">Or use demo account</span>
                        </div>
                    </div>

                    {/* Demo Login */}
                    <button
                        onClick={() => handleLogin('credentials')}
                        disabled={!!isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-zinc-300 p-4 rounded-xl font-medium border border-white/5 transition-all transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {isLoading === 'credentials' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span>Try Demo Mode</span>
                        )}
                    </button>

                    <p className="text-xs text-center text-zinc-500 mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
