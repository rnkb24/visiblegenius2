import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

/**
 * Sends the image and secret prompt to the Gemini 3 Pro (Nano Banana Pro) engine.
 * Configured for 2K resolution and 4:3 aspect ratio as requested.
 */
export const generateTransmutedImage = async (
  base64Image: string,
  secretPrompt: string
): Promise<string> => {
  // Always create a fresh instance right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // The Gemini 3 Pro image preview model expects this specific object structure for contents
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
        // Safety settings are omitted to prevent 400 INVALID_ARGUMENT errors and allow the engine's default logic
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) {
      throw new Error("The engine did not return a valid response. This may be due to a temporary server limitation at 2K resolution.");
    }

    const parts = candidate.content.parts;
    let foundImageUrl: string | null = null;

    // Iterate through parts to find the generated image
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
      throw new Error("Transmutation failed: The engine returned content but no image data was found.");
    }

    return foundImageUrl;

  } catch (error: any) {
    console.error("VisibleGenius Engine Error:", error);
    
    // Check for common API errors
    if (error.message?.includes("400") || error.message?.includes("INVALID_ARGUMENT")) {
      throw new Error("Engine Configuration Error: The parameters (2K/4:3) might be temporarily unsupported in this region.");
    }
    
    throw error;
  }
};