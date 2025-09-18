
import { GoogleGenAI } from "@google/genai";
import type { NewsletterOptions, ResearchResult, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const researchTopic = async (topic: string): Promise<ResearchResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please research the topic: "${topic}". Provide a comprehensive summary that includes key points, important statistics, and any notable quotes. The summary should be well-structured and easy to read.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
        
        return { summary, sources };
    } catch (error) {
        console.error("Error researching topic:", error);
        throw new Error("Failed to fetch research data from the API.");
    }
};

export const generateNewsletter = async (
    options: NewsletterOptions,
    researchSummary: string,
    userNotes: string
): Promise<string> => {
    const { topic, style, tone } = options;

    const researchContext = researchSummary ? `\n\nHere is some research on the topic:\n${researchSummary}` : '';
    const notesContext = userNotes ? `\n\nHere are some personal notes to incorporate:\n${userNotes}` : '';

    const prompt = `
        Create a high-quality, engaging newsletter with a word count between 600 and 1000 words.

        **Newsletter Details:**
        - **Main Topic:** "${topic}"
        - **Writing Style:** ${style}
        - **Tone:** ${tone}

        **Instructions:**
        1.  Start with a catchy headline.
        2.  Write a compelling introduction to grab the reader's attention.
        3.  Develop the main body of the newsletter, structuring it with clear headings and subheadings.
        4.  Incorporate the provided research and notes seamlessly into the content.
        5.  Use paragraphs, bullet points, and bold text to improve readability.
        6.  Conclude with a strong summary or a call-to-action.
        7.  Ensure the final output is formatted using Markdown.

        ${researchContext}
        ${notesContext}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating newsletter:", error);
        throw new Error("Failed to generate the newsletter.");
    }
};

export const editNewsletter = async (
    originalContent: string,
    editPrompt: string
): Promise<string> => {
    const prompt = `
        Please edit the following newsletter based on the instruction provided.
        Return the full, revised newsletter with the edits incorporated. Use Markdown for formatting.

        **Instruction:** "${editPrompt}"

        **Original Newsletter:**
        ---
        ${originalContent}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error editing newsletter:", error);
        throw new Error("Failed to edit the newsletter.");
    }
};
