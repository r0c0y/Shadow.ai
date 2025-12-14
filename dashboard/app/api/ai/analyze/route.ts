
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for input validation
const AnalyzeSchema = z.object({
    code: z.string().min(1),
    model: z.string().optional(),
    context: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { code, context } = AnalyzeSchema.parse(body);

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
      You are Agent Zero, an advanced AI coding assistant.
      
      Analyze the following code snippet for potential bugs, performance issues, security vulnerabilities, and code quality improvements.
      
      Context: ${context || "No specific context provided."}
      
      Code:
      \`\`\`
      ${code}
      \`\`\`
      
      Provide your response in the following JSON format:
      {
        "summary": "Brief summary of findings",
        "score": 0-100 (Code Quality Score),
        "issues": [
          {
             "type": "bug" | "security" | "performance" | "style",
             "severity": "high" | "medium" | "low",
             "message": "Description of the issue",
             "suggestion": "How to fix it",
             "line": number (approximate line number if possible, else 0)
          }
        ],
        "improvedCode": "The fixed version of the code (optional, only if significant changes needed)"
      }
      
      Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(responseText);
            return NextResponse.json({ success: true, ...jsonResponse });
        } catch (e) {
            console.error("Failed to parse JSON from AI", responseText);
            // Fallback if AI didn't return perfect JSON
            return NextResponse.json({
                success: true,
                summary: "Analysis completed but format was unstructured.",
                rawDetails: responseText,
                score: 70,
                issues: []
            });
        }

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return NextResponse.json(
            { error: "Analysis failed", details: (error as any).message },
            { status: 500 }
        );
    }
}
