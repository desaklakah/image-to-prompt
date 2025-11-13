
import { GoogleGenAI, Type } from "@google/genai";
import { PromptData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const systemInstruction = `You are an advanced image-to-text prompt engineer AI. Your job is to describe any uploaded image with extreme precision and structure it into a ready-to-use prompt for image-generation models such as Midjourney, DALL·E, or Stable Diffusion.

Rules:
1. Describe all visible elements objectively: subject, pose, environment, lighting, color palette, materials, mood, camera style, composition, and style.
2. DO NOT guess identity or use proper names of real people or copyrighted characters.
3. Always include a detailed "positive prompt", "negative prompt", and "generation parameters".
4. Maintain descriptive richness, but avoid artistic exaggeration unless visible in the image.
5. Output ONLY in the specified JSON structure. Do not include any other text or markdown formatting.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    positive_prompt: {
      type: Type.STRING,
      description: "A detailed, objective description of the image's content, style, and composition for the AI to generate.",
    },
    negative_prompt: {
      type: Type.STRING,
      description: "A list of elements to exclude from the generated image, such as poor quality, deformities, or unwanted objects.",
    },
    parameters: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING, description: "The artistic style of the image (e.g., 'photorealistic', 'impressionistic', 'anime')." },
        lighting: { type: Type.STRING, description: "Description of the lighting (e.g., 'soft natural light', 'dramatic studio lighting')." },
        camera: { type: Type.STRING, description: "Camera settings and perspective (e.g., 'close-up shot, 50mm lens, shallow depth of field')." },
        color_palette: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "An array of dominant hex color codes from the image."
        },
        cfg_scale: { type: Type.STRING, description: "A recommended CFG scale value (e.g., '7.5')." },
        steps: { type: Type.STRING, description: "A recommended number of generation steps (e.g., '30')." },
        sampler: { type: Type.STRING, description: "A recommended sampler method (e.g., 'DPM++ 2M Karras')." },
        seed: { type: Type.STRING, description: "A random seed value or '-1' for random." },
        aspect_ratio: { type: Type.STRING, description: "The aspect ratio of the image (e.g., '16:9')." },
      },
      required: ["style", "lighting", "camera", "color_palette", "cfg_scale", "steps", "sampler", "seed", "aspect_ratio"],
    },
  },
  required: ["positive_prompt", "negative_prompt", "parameters"],
};

export const generatePromptFromImage = async (imageFile: File): Promise<PromptData> => {
  try {
    const base64Data = await fileToBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageFile.type,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart] },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData: PromptData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("Error generating prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the prompt.");
  }
};
