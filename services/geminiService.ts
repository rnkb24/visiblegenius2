import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

export const generateTransmutedImage = async (
  base64Image: string,
  secretPrompt: string
): Promise<string> => {
  // Always create a fresh instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Standardizing contents to the object-based format preferred by the image generation preview
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
        // Safety settings removed to minimize request parameters and avoid potential argument conflicts
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) {
      throw new Error("No output generated. The request may have been blocked or failed to process.");
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
      // If no image, check if there's text feedback
      const textPart = parts.find(p => p.text);
      if (textPart?.text) {
        throw new Error(`Model Response: ${textPart.text}`);
      }
      throw new Error("Transmutation failed: No image data was returned by the engine.");
    }

    return foundImageUrl;

  } catch (error: any) {
    console.error("Critical Engine Error:", error);
    // Log the full structure for debugging if it happens again
    if (error.response) {
      console.error("API Error Payload:", JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
};