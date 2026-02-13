import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

export const generateTransmutedImage = async (
  base64Image: string,
  secretPrompt: string
): Promise<string> => {
  // CRITICAL: Create a new instance right before the call to ensure fresh API key
  // This is required for the user-selected key flow.
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
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity from canvas export
            },
          },
        ],
      },
      config: {
        // Nano Banana Pro (gemini-3-pro-image-preview) supports imageConfig
        imageConfig: {
          imageSize: "2K", // Updated to 2K resolution
          aspectRatio: "4:3", // Updated to 4:3 aspect ratio
        },
      },
    });

    // Parse response for image
    // The output response may contain both image and text parts; iterate to find image.
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const parts = candidates[0].content.parts;
    let foundImageUrl: string | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        foundImageUrl = `data:image/png;base64,${base64EncodeString}`;
        break; // Found it
      }
    }

    if (!foundImageUrl) {
      throw new Error("No image data found in the response.");
    }

    return foundImageUrl;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};