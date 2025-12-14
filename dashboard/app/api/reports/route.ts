import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';

export async function GET() {
    try {
        await dbConnect();
        const reports = await Report.find({}).sort({ timestamp: -1 }).limit(50);
        return NextResponse.json({ success: true, data: reports });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Upsert logic: if executionId exists, update it, otherwise create
        // This allows the flow to post multiple updates if needed, though typically once is enough.
        const report = await Report.findOneAndUpdate(
            { executionId: body.executionId },
            body,
            { new: true, upsert: true } // Create if not exists
        );

        return NextResponse.json({ success: true, data: report });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
