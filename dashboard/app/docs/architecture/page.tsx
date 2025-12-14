
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ArchitectureDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">System Architecture</h1>
                <p className="text-gray-400 text-lg">
                    A hybrid cloud/local architecture leveraging the best of Next.js, Kestra, and Browser Extensions.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">High-Level Overview</h2>
                    <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex justify-center">
                        <img
                            src="/architecture-diagram.png"
                            alt="Agent Zero System Architecture"
                            className="rounded-lg shadow-2xl shadow-emerald-500/10 max-w-full h-auto"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Component Breakdown</h2>

                    <div className="grid grid-cols-1 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">1. Chrome Extension (The "Eyes")</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400 space-y-2">
                                <p><strong>Stack:</strong> React, Tailwind, Manifest V3.</p>
                                <p><strong>Role:</strong> Injects UI into GitHub, captures user context (selection, PR info), and communicates with the backend.</p>
                                <p><strong>Key Feature:</strong> "Ghost Mode" for non-intrusive selection.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">2. Dashboard & API (The "Brain")</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400 space-y-2">
                                <p><strong>Stack:</strong> Next.js 14, MongoDB, NextAuth.</p>
                                <p><strong>Role:</strong> Manages user sessions, stores history/settings, and acts as the API Gateway for AI models (Gemini/Groq).</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">3. Kestra (The "Nervous System")</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400 space-y-2">
                                <p><strong>Stack:</strong> Java/Docker.</p>
                                <p><strong>Role:</strong> Handles long-running workflows, retries, and integrations. It ensures that if a task fails (e.g., GitHub API timeout), it is retried without losing state.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg text-white">4. Cline (The "Hands")</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400 space-y-2">
                                <p><strong>Stack:</strong> Node.js CLI.</p>
                                <p><strong>Role:</strong> Autonomous execution. Maintains a local sandbox of the repo to perform complexity analysis and refactoring before pushing changes.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    );
}
