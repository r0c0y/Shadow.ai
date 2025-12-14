
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Get latest execution ID
        const listRes = await fetch('http://localhost:8080/api/v1/executions?namespace=com.agentzero&flowId=github-events&sort=startDate:desc&size=1', { cache: 'no-store' });
        const listData = await listRes.json();

        if (!listData.results || listData.results.length === 0) {
            return NextResponse.json({ logs: ["No executions found."] });
        }

        const execId = listData.results[0].id;

        // 2. Fetch Logs for this execution
        // Kestra API for logs: /api/v1/logs/{executionId}
        const logsRes = await fetch(`http://localhost:8080/api/v1/logs/${execId}`, { cache: 'no-store' });
        const logsData = await logsRes.json();

        return NextResponse.json({
            executionId: execId,
            logs: logsData.map((l: any) => `[${l.timestamp}] [${l.level}] ${l.message}`)
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
