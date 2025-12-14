
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function KestraDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Kestra Integration</h1>
                <p className="text-gray-400 text-lg">
                    Event-driven orchestration for messy, real-world workflows that mix code, APIs, infra, humans, and AI.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Why Kestra?</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If Airflow is for data pipelines, Kestra is for systems. We use Kestra to orchestrate the entire lifecycle of our agentic interactions. From the moment a Pull Request is opened or code is selected, Kestra takes over to manage the flow of data between GitHub, our AI models (Gemini/Groq), and our notification systems (Slack/Email).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Our Workflows</h2>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">1. Interactive PR Analysis (`interactive-pr-fix`)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-gray-300">
                            <p><strong>Trigger:</strong> New PR Opened or Manual Trigger via Dashboard.</p>
                            <p><strong>Process:</strong></p>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                <li>Extracts diff from GitHub.</li>
                                <li>Runs parallel Security (SAST) and Logic analysis.</li>
                                <li>Generates a complexity score (MCS Badge).</li>
                                <li>If critical issues found, triggers Slack Alert.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">2. Advanced Lifecycle (`advanced-code-lifecycle`)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-gray-300">
                            <p><strong>Trigger:</strong> Complex Refactor Request.</p>
                            <p><strong>Process:</strong></p>
                            <ul className="list-disc list-inside space-y-1 pl-4">
                                <li>Deep codebase scan.</li>
                                <li>Orchestrates <strong>Cline CLI</strong> to perform autonomous refactoring in a sandboxed environment.</li>
                                <li>Verifies changes with tests.</li>
                                <li>Posts results back to the PR.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Integration Architecture</h2>
                    <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex justify-center">
                        <img
                            src="/kestra-flow.png"
                            alt="Kestra Workflow Diagram"
                            className="rounded-lg shadow-2xl shadow-emerald-500/10 max-w-full h-auto"
                        />
                    </div>
                    <p className="text-gray-300">
                        This architecture ensures that our extension remains lightweight while offloading heavy processing to Kestra's robust orchestration engine.
                    </p>
                </section>
            </div>
        </div>
    );
}
