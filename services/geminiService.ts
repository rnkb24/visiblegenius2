import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
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

    // Parse response for image
    // The output response may contain both image and text parts; iterate to find image.
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const candidate = candidates[0];

    // Handle cases where content is blocked or empty (e.g. SAFETY)
    if (!candidate.content) {
      if (candidate.finishReason) {
        throw new Error(`Model stopped generation. Reason: ${candidate.finishReason}`);
      }
      throw new Error("No content returned from Gemini.");
    }

    const parts = candidate.content.parts;
    
    // Validate parts existence before iterating
    if (!parts || !Array.isArray(parts)) {
      throw new Error("Response content is missing valid parts.");
    }

    let foundImageUrl: string | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        foundImageUrl = `data:image/png;base64,${base64EncodeString}`;
        break; // Found it
      }
    }

    if (!foundImageUrl) {
      // Check if there is a text part explaining the failure (e.g. "I cannot generate images of...")
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