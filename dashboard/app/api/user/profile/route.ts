
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let user = await User.findOne({ email: session.user.email });

    // Create user if not exists (lazy creation on first profile access if auth didn't do it)
    if (!user) {
        user = await User.create({
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
        });
    }

    return NextResponse.json(user);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const user = await User.findOneAndUpdate(
        { email: session.user.email },
        {
            $set: {
                "integrations.slack": body.slack,
                "integrations.emailDigest": body.emailDigest
            }
        },
        { new: true, upsert: true }
    );

    return NextResponse.json(user);
}
