import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

/**
 * Sends the image and secret prompt to the Gemini 3 Pro (Nano Banana Pro) engine.
 * Utilizes dynamic aspect ratios detected from the source image to avoid distortion.
 * Uses 1K resolution for optimal stability across all regions in preview mode.
 */
export const generateTransmutedImage = async (
  base64Image: string,
  secretPrompt: string,
  aspectRatio: string = "1:1"
): Promise<string> => {
  // Fresh instance to ensure the most recent API key from the environment
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
          imageSize: "1K", // 1K is the most stable choice for non-standard aspect ratios
          aspectRatio: aspectRatio,
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) {
      throw new Error("The engine did not return a valid response. This may be due to safety filters or regional limits.");
    }

    const parts = candidate.content.parts;
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
        throw new Error(`Engine Feedback: ${textPart.text}`);
      }
      throw new Error("The engine completed the process but did not provide a visual output.");
    }

    return foundImageUrl;

  } catch (error: any) {
    console.error("VisibleGenius Service Error:", error);
    
    // Improved error handling for common API issues
    if (error.message?.includes("400") || error.message?.includes("INVALID_ARGUMENT")) {
      throw new Error("Engine Configuration Error: The model rejected this parameter combination. Please try a different formula or image.");
    }
    
    if (error.message?.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a moment before trying another transmutation.");
    }

    throw error;
  }
};