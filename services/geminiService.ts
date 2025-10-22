
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateMockupImage(
  userPrompt: string,
  aspectRatio: string,
  uploadedImageB64: string | null
): Promise<string | null> {

  if (uploadedImageB64) {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: uploadedImageB64,
      },
    };

    const textPart = {
      text: `Task: Generate a photorealistic mockup scene based on the text description, and place the provided image onto the screen of a device within that scene.

      Description for the scene: "${userPrompt}"

      Instructions:
      1.  **Primary Goal:** The provided image MUST be displayed on the screen of a device (like a phone, laptop, monitor, or tablet) within the generated mockup.
      2.  **Scene Generation:** The environment around the device should be based on the text description. For example, if the description is "a home office at sunrise," create that scene and place a device with the user's image on its screen in that office.
      3.  **Realism:** Ensure the final image is photorealistic. Pay attention to lighting, shadows, and reflections on the device screen to make it look natural in the environment.
      4.  **Do Not Alter Image:** The user's image should be placed as-is, without modification, fitting neatly within the device's screen boundaries.
      5.  **Style:** The overall aesthetic should be modern, clean, and professional, suitable for a portfolio (inspired by Dribbble/Behance).
      
      The final output must be a single, cohesive, high-resolution image that looks like a real product screenshot in a realistic setting.`
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
      return null;

    } catch (error) {
      console.error("Error generating image with Gemini API (multimodal):", error);
      throw new Error("Falha ao se comunicar com a API Gemini. Verifique o console para mais detalhes.");
    }

  } else {
    const detailedPrompt = `
      A photorealistic, high-fidelity UI mockup for: "${userPrompt}".
      Style: modern, clean, professional.
      Inspiration: Dribbble, Behance, award-winning designs.
      Details: sharp focus, clear typography, intuitive layout, professional color palette.
      This is for a professional portfolio, it needs to look like a real product screenshot.
      No text artifacts or gibberish. Any text should look like plausible placeholder text (lorem ipsum).
      Final output must be a high-resolution, photorealistic image.
    `;

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: detailedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3",
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
      }
      return null;
    } catch (error) {
      console.error("Error generating image with Gemini API (text-only):", error);
      throw new Error("Falha ao se comunicar com a API Gemini. Verifique o console para mais detalhes.");
    }
  }
}
