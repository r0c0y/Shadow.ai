
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
                    <h2 className="text-2xl font-semibold text-emerald-400">Integration Deep Dive</h2>
                    <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex justify-center mb-6">
                        <img
                            src="/kestra-flow.png"
                            alt="Kestra Workflow Diagram"
                            className="rounded-lg shadow-2xl shadow-emerald-500/10 max-w-full h-auto"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">Flow Configuration (YAML)</h3>
                    <p className="text-gray-300 mb-4">
                        Our flows are defined in simple YAML but pack a punch. Here is a simplified view of the <code>interactive-pr-fix</code> flow:
                    </p>

                    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden font-mono text-xs text-gray-300">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            <span className="ml-2 opacity-50">flows/interactive-pr-fix.yaml</span>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre>{`id: interactive-pr-fix
namespace: com.agentzero
inputs:
  - name: pr_url
    type: STRING
    description: "The GitHub Pull Request URL"

tasks:
  - id: analyze_impact
    type: io.kestra.plugin.scripts.python.Script
    script: |
      import os
      # Uses Gemini to reason about the PR impact
      impact_score = analyze_pr(os.getenv("PR_URL"))
      print(f"::output::{impact_score}")

  - id: decision
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ outputs.analyze_impact.vars.score > 80 ? 'CRITICAL' : 'SAFE' }}"
    cases:
      CRITICAL:
        - id: alert_team
          type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
          url: "{{ secret('SLACK_WEBHOOK') }}"
          payload: |
            {"text": "🚨 High Risk PR Detected!"}
      SAFE:
        - id: auto_approve
          type: io.kestra.plugin.scripts.shell.Commands
          commands:
            - gh pr review --approve`}</pre>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Plugins Used</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-bold text-emerald-400 mb-1">Python Script</div>
                            <div className="text-sm text-gray-400">
                                Executes complex AI reasoning logic using standard libraries + custom ML packages.
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-bold text-emerald-400 mb-1">Docker Runner</div>
                            <div className="text-sm text-gray-400">
                                Isolates execution. Each step runs in a clean `python:3.11-slim` or custom container.
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-bold text-emerald-400 mb-1">GitHub Webhook</div>
                            <div className="text-sm text-gray-400">
                                Instantly triggers flows based on `pull_request` or `issue_comment` events.
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-bold text-purple-400 mb-1">Cline Bridge</div>
                            <div className="text-sm text-gray-400">
                                Custom integration to hand off tasks to our autonomous agent (see <a href="/docs/cline" className="underline hover:text-white">Cline Docs</a>).
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
