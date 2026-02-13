import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { MODEL_NAME } from "../constants";

export const generateTransmutedImage = async (
  base64Image: string,
  secretPrompt: string
): Promise<string> => {
  // CRITICAL: Create a new instance right before the call to ensure fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: secretPrompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: "2K",
          aspectRatio: "4:3",
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const candidate = candidates[0];

    if (!candidate.content) {
      if (candidate.finishReason) {
        throw new Error(`Model stopped generation. Reason: ${candidate.finishReason}`);
      }
      throw new Error("No content returned from Gemini.");
    }

    const parts = candidate.content.parts;
    
    if (!parts || !Array.isArray(parts)) {
      throw new Error("Response content is missing valid parts.");
    }

    let foundImageUrl: string | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        foundImageUrl = `data:image/png;base64,${base64EncodeString}`;
        break; 
      }
    }

    if (!foundImageUrl) {
      const textPart = parts.find(p => p.text);
      if (textPart?.text) {
        throw new Error(`Generation failed: ${textPart.text}`);
      }
      throw new Error("No image data found in the response.");
    }

    return foundImageUrl;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};