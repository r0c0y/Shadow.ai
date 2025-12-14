
import { Card, CardContent } from "@/components/ui/card";
import { Download, Github, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SetupDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Getting Started</h1>
                <p className="text-gray-400 text-lg">
                    Setup Agent Zero in less than 5 minutes.
                </p>
            </div>

            <div className="space-y-8">

                {/* Step 1 */}
                <div className="relative border-l border-emerald-500/30 pl-8 ml-4">
                    <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black font-bold text-xs ring-4 ring-black">1</span>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Install the Extension</h3>
                        <p className="text-gray-400">Download the unpacked extension and load it into Chrome.</p>
                        <div className="bg-black/50 p-4 rounded-lg border border-white/10 mt-2">
                            <p className="text-xs text-gray-400">Since we are in private beta/hackathon mode:</p>
                            <ol className="list-decimal list-inside text-sm text-gray-300 mt-2 space-y-1">
                                <li>Go to <code className="text-emerald-300">chrome://extensions</code></li>
                                <li>Enable <strong>Developer Mode</strong> (top right)</li>
                                <li>Click <strong>Load Unpacked</strong></li>
                                <li>Select the <code className="text-emerald-300">agent-zero/chrome-extension/dist</code> folder</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative border-l border-emerald-500/30 pl-8 ml-4">
                    <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black font-bold text-xs ring-4 ring-black">2</span>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Connect Dashboard</h3>
                        <p className="text-gray-400">Create your account to sync settings and enable high-tier agents.</p>
                        <Link href="/api/auth/signin" className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors">
                            <Github size={16} />
                            Login with GitHub
                        </Link>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative border-l border-white/10 pl-8 ml-4">
                    <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-white font-bold text-xs ring-4 ring-black">3</span>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">First Run</h3>
                        <p className="text-gray-400">Visit any GitHub repository. You should see:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500" />
                                    <span className="text-sm text-gray-300">Agent Zero status in toolbar</span>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500" />
                                    <span className="text-sm text-gray-300">Hover triggers on code lines</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
