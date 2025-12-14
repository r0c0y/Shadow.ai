
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const ScanSchema = z.object({
    code: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code } = ScanSchema.parse(body);

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
      You are Agent Zero Security Auditor. Scan the following code for security vulnerabilities.
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
      
      Provide your response in JSON format:
      {
        "isSecure": boolean,
        "vulnerabilities": [
           {
             "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
             "type": "SQL Injection" | "XSS" | "Auth" | "Other",
             "description": "What is the risk?",
             "fix": "How to fix it"
           }
        ]
      }
      
      Return ONLY valid JSON.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(responseText);
            return NextResponse.json({ success: true, ...jsonResponse });
        } catch (e) {
            return NextResponse.json({
                success: true,
                isSecure: false,
                vulnerabilities: [{ severity: "LOW", type: "Parse Error", description: "Could not parse AI response", fix: "Check raw logs" }],
                raw: responseText
            });
        }

    } catch (error) {
        return NextResponse.json(
            { error: "Scan failed", details: (error as any).message },
            { status: 500 }
        );
    }
}
