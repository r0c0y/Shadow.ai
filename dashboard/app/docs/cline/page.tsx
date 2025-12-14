
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ClineDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Cline CLI Integration</h1>
                <p className="text-gray-400 text-lg">
                    Autonomous coding agent that executes real commands, edits real files, and reasons across your codebase.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-400">What is Cline in Agent Zero?</h2>
                    <p className="text-gray-300 leading-relaxed">
                        While Agent Zero's extension acts as the "eyes" and "intent" (Analysis), Cline acts as the "hands" (Execution). We leverage the Cline CLI to perform actual code modifications, refactorings, and test generations based on the analysis provided by the agent.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-400">Key Capabilities</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-base text-white">Repo-wide Understanding</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400">
                                Cline scans files, follows imports, and builds a mental model of your architecture to answer complex questions like "How does auth work globally?".
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-base text-white">Safe Refactoring</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400">
                                "Migrate from JWT to Session". Cline finds logic, modifies files, updates tests, and verifies the build—all autonomously.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-purple-400">The Autonomous Loop</h2>
                    <p className="text-gray-300">
                        Cline doesn't just "guess" code. It operates in a tight feedback loop, similar to a human engineer.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <Card className="bg-purple-900/10 border-purple-500/20">
                            <CardHeader className="pb-2">
                                <div className="text-xs font-mono text-purple-400 mb-1">STEP 1</div>
                                <CardTitle className="text-lg text-white">Observation</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400">
                                Analyzes file structure, reads READMEs, and understands the current state of the repo using <code>fs.list_dir</code>.
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-900/10 border-purple-500/20">
                            <CardHeader className="pb-2">
                                <div className="text-xs font-mono text-purple-400 mb-1">STEP 2</div>
                                <CardTitle className="text-lg text-white">Reasoning (CoT)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400">
                                Uses Chain-of-Thought prompting to plan a fix. "I need to install lodash, then update the import in utils.ts".
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-900/10 border-purple-500/20">
                            <CardHeader className="pb-2">
                                <div className="text-xs font-mono text-purple-400 mb-1">STEP 3</div>
                                <CardTitle className="text-lg text-white">Action & Verify</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-400">
                                Executes <code>npm install</code>, edits files via <code>replace_file</code>, and runs tests to confirm success.
                            </CardContent>
                        </Card>
                    </div>

                    <h2 className="text-2xl font-semibold text-purple-400 pt-4">Tool Definition</h2>
                    <p className="text-gray-300 mb-4">
                        Agent Zero exposes a strictly defined set of tools to Cline. This is how we ensure safety.
                    </p>
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6 font-mono text-sm text-gray-300 space-y-4">
                        <div className="flex gap-4">
                            <span className="text-emerald-400 w-32 shrink-0">read_file</span>
                            <span>Reads content. Enforces size limits to prevent context overflow.</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-emerald-400 w-32 shrink-0">write_to_file</span>
                            <span>Creates new files. Validates path traversal attempts.</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-emerald-400 w-32 shrink-0">run_command</span>
                            <span>Executes terminal commands. Root access is disabled by default.</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-emerald-400 w-32 shrink-0">browser_action</span>
                            <span>Navigate, click, and type in a headless Puppeteer instance.</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-purple-400 pt-8">Security & Sandbox</h2>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Docker Isolation</strong>
                                    All Cline instances run in ephemeral Docker containers. They are destroyed immediately after task completion.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Network Allow-listing</strong>
                                    Egress is restricted. Agents can pull from npm/pypi but cannot connect to arbitrary IPs unless whitelisted.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <div>
                                    <strong className="text-white block">Human-in-the-Loop</strong>
                                    For high-stakes repos, Agent Zero can be configured to require manual approval via <a href="/docs/kestra" className="underline text-emerald-400">Kestra</a> before acting.
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
