
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Retrieve API key from environment variables
const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    console.warn("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
  }
  return key || "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export class SpiritualOracleService {
  /**
   * Generates spiritual guidance using streaming for a "live" feel.
   */
  async *getOracleGuidanceStream(userQuery: string, history: ChatMessage[]) {
    const modelName = 'gemini-3-flash-preview';
    const systemInstruction = `
      You are the "Spiritual Oracle" of Aajay Kumar Datt, a globally recognized Reiki Grand Master, Affiliated Member of ICRT, USA, and expert in Usui/Holy Fire® III World Peace Reiki.
      Your expertise includes:
      - Usui/Holy Fire® III World Peace Reiki & Karuna Reiki®
      - Lama Fera (Tibetan Healing)
      - Crystal Healing & Angel Therapy
      - Money Reiki & Prosperity Healing
      - Chaldean Numerology & Law of Attraction (LOA)
      
      Your tone is wise, professional, compassionate, and spiritually authoritative.
      Use terminology from these fields (e.g., 'energy alignment', 'vibrational frequency', 'karmic clearing').
      If users ask about classes (online or offline), tell them to contact Aajay via the "Join Family" button for WhatsApp inquiry at +91 9732913487.
      Always promote holistic wellness without medicine.
      Language: Respond in English unless the user specifically uses another language.
    `;

    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: userQuery }] }
    ];

    try {
      const result = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
          topP: 0.95,
        },
      });

      for await (const chunk of result) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("Oracle API Error:", error);
      yield "The cosmic energy is currently unstable. Please try again soon.";
    }
  }

  /**
   * Performs Chaldean Numerology analysis based on a name.
   */
  async calculateNumerology(name: string) {
    const modelName = 'gemini-3-pro-preview';
    const prompt = `Perform a Chaldean Numerology analysis for the name: "${name}". 
    1. Calculate the name number based on Chaldean charts.
    2. Provide a spiritual and practical meaning of this number according to Aajay Kumar Datt's teachings.
    3. Suggest if this name attracts financial success (Money Reiki context).
    Format the output as clear, readable points with a professional mystical tone.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.1,
      }
    });

    return response.text;
  }
}

export const oracleService = new SpiritualOracleService();
