
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Here we would trigger the actual Cline CLI process
        // e.g. exec('cline --task "..."')
        console.log("🚀 Cline CLI Triggered:", body.task);

        return NextResponse.json({
            success: true,
            message: "Cline CLI task queued",
            taskId: "cline-" + Date.now()
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to trigger Cline" }, { status: 500 });
    }
}
