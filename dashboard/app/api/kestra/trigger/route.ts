import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Kestra Lite runs on localhost:8080
        const KESTRA_URL = 'http://localhost:8080/api/v1/executions/webhook/com.agentzero/agent_zero_lite/github-trigger';

        const payload = {
            "repository": "agent-zero-demo/vulnerable-app",
            "pr_number": 1
        };

        const response = await fetch(KESTRA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ success: false, error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, executionId: data.id });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
