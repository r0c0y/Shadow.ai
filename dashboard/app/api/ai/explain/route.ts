
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const ExplainSchema = z.object({
    code: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code } = ExplainSchema.parse(body);

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key not found. Please set GEMINI_API_KEY in .env" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are Agent Zero. Explain the following code snippet clearly and concisely for a developer.
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
      
      Format your response using Markdown. Include:
      1. **Purpose**: What does this code do?
      2. **Logic Flow**: How does it work?
      3. **Key Concepts**: Any specific patterns or libraries used.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ success: true, explanation: responseText });

    } catch (error) {
        return NextResponse.json(
            { error: "Explanation failed", details: (error as any).message },
            { status: 500 }
        );
    }
}
