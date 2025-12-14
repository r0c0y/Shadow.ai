
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const MCSSchema = z.object({
    title: z.string(),
    description: z.string(),
    files_changed_count: z.number().optional(),
    additions: z.number().optional(),
    deletions: z.number().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, files_changed_count, additions, deletions } = MCSSchema.parse(body);

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
      You are Agent Zero, an expert software architect.
      Calculate a "Merge Candidate Score" (0-100) for this Pull Request.
      
      Parameters:
      - Title: "${title}"
      - Description: "${description}"
      - Files Changed: ${files_changed_count || "Unknown"}
      - Additions: ${additions || "Unknown"}
      - Deletions: ${deletions || "Unknown"}
      
      Scoring Criteria:
      - Clarity: Is the intent clear? (Description length/quality)
      - Size: Is it too big? (Over 1000 lines is risky)
      - Risk: Vague title? "Fix bug" is bad. "Fix NPE in UserAuth" is good.
      
      Return JSON:
      {
        "score": number,
        "status": "MERGE_CANDIDATE" | "NEEDS_REVIEW" | "AUTOCORRECT",
        "reasoning": "One sentence explanation."
      }
      
      Return ONLY valid JSON.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(responseText);
            return NextResponse.json({ success: true, ...jsonResponse });
        } catch (e) {
            console.error("Failed to parse MCS JSON", responseText);
            // Fallback logic
            const fallbackScore = description.length > 50 ? 80 : 40;
            return NextResponse.json({
                success: true,
                score: fallbackScore,
                status: fallbackScore > 70 ? "MERGE_CANDIDATE" : "NEEDS_REVIEW",
                reasoning: "Analysis format error, using heuristic based on description length."
            });
        }

    } catch (error) {
        console.error("MCS Analysis Failed:", error);
        return NextResponse.json(
            { error: "Analysis failed", details: (error as any).message },
            { status: 500 }
        );
    }
}
