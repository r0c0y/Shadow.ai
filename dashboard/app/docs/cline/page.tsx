
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
                    <h2 className="text-2xl font-semibold text-purple-400">How We Use It</h2>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h3 className="text-white font-medium mb-2">The "Infinity Build" Workflow</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                            <li><strong>Trigger:</strong> User identifies a deprecated function in a PR via the Chrome Extension.</li>
                            <li><strong>Action:</strong> User clicks "Auto-Refactor with Cline".</li>
                            <li><strong>Orchestration:</strong> Kestra receives the task and spins up a Cline container.</li>
                            <li><strong>Execution:</strong> Cline (`dine`) runs against the repo, commits the fix, and pushes back to the branch.</li>
                            <li><strong>Result:</strong> PR is updated with the fix automatically.</li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
    );
}
