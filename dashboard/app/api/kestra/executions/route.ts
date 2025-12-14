
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('http://localhost:8080/api/v1/executions?namespace=com.agentzero&flowId=github-events&sort=startDate:desc&size=20', {
            cache: 'no-store',
        });

        if (!res.ok) throw new Error("Kestra API Error");

        const data = await res.json();
        return NextResponse.json(data.results || []);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 });
    }
}
