
export const AI_CONFIG = {
    // Rotation logic for keys
    getGeminiKey: () => {
        const keys = (process.env.GEMINI_KEYS || "").split(",").filter(Boolean);
        if (keys.length === 0) return process.env.GEMINI_API_KEY;

        // Randomly select a key for load balancing/rotation
        const randomIndex = Math.floor(Math.random() * keys.length);
        return keys[randomIndex];
    },

    getGroqKey: () => {
        return process.env.GROQ_API_KEY;
    }
}
