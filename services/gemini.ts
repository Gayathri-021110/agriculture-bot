
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export async function askAgriAssistant(
  prompt: string,
  location?: { lat: number; lng: number }
) {
  const ai = getGeminiClient();
  const locationContext = location 
    ? `User current location: Latitude ${location.lat}, Longitude ${location.lng}. ` 
    : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${locationContext}${prompt}`,
    config: {
      systemInstruction: "You are AgriSense AI, a highly knowledgeable agricultural assistant. Use real-time internet data to provide specific, actionable advice for farmers. Focus on local weather, current commodity prices, sustainable farming practices, and pest management. Always maintain a helpful, professional, and encouraging tone. If asked about prices, provide current market data if available.",
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "I'm sorry, I couldn't process that request.";
  
  // Extract grounding sources
  const sources: GroundingSource[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Reference",
          uri: chunk.web.uri
        });
      }
    });
  }

  return { text, sources };
}
