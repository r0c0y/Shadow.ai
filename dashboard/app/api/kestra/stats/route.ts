
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Fetch recent executions from Kestra API
        const res = await fetch('http://localhost:8080/api/v1/executions?namespace=com.agentzero&flowId=github-events&sort=startDate:desc&size=5', {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Kestra API error: ${res.status}`);
        }

        const data = await res.json();
        const executions = data.results || [];

        // 2. Calculate Stats based on real data
        const activeCount = executions.filter((e: any) => e.state.current === 'RUNNING' || e.state.current === 'CREATED').length;

        // Find latest successful or failed execution to get MCS
        // MCS is usually in outputs.calculate_mcs.vars.mcs
        // We scan executions to find one with outputs relative to MCS
        let latestScore = 0;
        let latestStatus = "UNKNOWN";

        for (const exec of executions) {
            if (exec.outputs && exec.outputs.calculate_mcs && exec.outputs.calculate_mcs.vars) {
                latestScore = exec.outputs.calculate_mcs.vars.mcs || 0;
                latestStatus = exec.outputs.calculate_mcs.vars.status || "UNKNOWN";
                break; // Found the latest relevant one
            }
        }

        return NextResponse.json({
            activeRequests: activeCount,
            latestScore: latestScore,
            latestStatus: latestStatus,
            recentActivity: executions.map((e: any) => ({
                id: e.id,
                state: e.state.current,
                date: e.state.startDate,
                trigger: e.trigger.variables?.body?.sender?.login || "System"
            }))
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to fetch Kestra stats" }, { status: 500 });
    }
}
