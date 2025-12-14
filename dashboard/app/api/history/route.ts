
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import History from "@/models/History";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const history = await History.create({
        userEmail: session.user.email,
        repo: body.repo,
        file: body.file,
        type: body.type,
        summary: body.summary
    });

    return NextResponse.json(history);
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const history = await History.find({ userEmail: session.user.email }).sort({ timestamp: -1 }).limit(10);

    return NextResponse.json(history);
}
