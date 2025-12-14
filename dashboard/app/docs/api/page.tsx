
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiRefDocs() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">API Reference</h1>
                <p className="text-gray-400 text-lg">
                    Interact with Agent Zero's core intelligence programmatically.
                </p>
            </div>

            <div className="space-y-8">

                {/* MCS Score */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">MCS Score Analysis</h2>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">POST</Badge>
                                <code className="text-white text-sm bg-black/50 px-2 py-1 rounded">/api/mcs-score</code>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-300">
                            <p>Generates a Merge Candidate Score (MCS) based on PR metadata and diff statistics.</p>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Request Body</h4>
                                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-emerald-300">
                                    {`{
  "prUrl": "string",
  "title": "string",
  "description": "string",
  "additions": number,
  "deletions": number,
  "files_changed_count": number
}`}
                                </pre>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Response</h4>
                                <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-blue-300">
                                    {`{
  "score": 85,
  "status": "MERGE_CANDIDATE", // | "NEEDS_REVIEW" | "AUTOCORRECT"
  "reasoning": "Changes are isolated..."
}`}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* AI Analysis */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">AI Intelligence</h2>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">POST</Badge>
                                <code className="text-white text-sm bg-black/50 px-2 py-1 rounded">/api/ai/analyze</code>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-300">
                            <p>Performs deep code analysis using the configured model (Gemini/Groq).</p>
                            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-emerald-300">
                                {`{
  "code": "function()...",
  "model": "gemini-pro"
}`}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">POST</Badge>
                                <code className="text-white text-sm bg-black/50 px-2 py-1 rounded">/api/ai/scan</code>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-300">
                            <p>Scans code snippet for security vulnerabilities (SAST).</p>
                        </CardContent>
                    </Card>
                </section>

                {/* User Profile */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">User Profile</h2>
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">GET</Badge>
                                <code className="text-white text-sm bg-black/50 px-2 py-1 rounded">/api/user/profile</code>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-300">
                            <p>Retrieves the authenticated user's profile, including integration settings and API keys.</p>
                        </CardContent>
                    </Card>
                </section>

            </div>
        </div>
    );
}
