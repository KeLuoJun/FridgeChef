import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFridgeAndGetRecipes = async (
  base64Image: string,
  dietaryRestrictions: string[] = []
): Promise<GeminiResponse> => {
  
  const dietaryText = dietaryRestrictions.length > 0 
    ? `请考虑这些饮食偏好: ${dietaryRestrictions.join(', ')}.` 
    : '';

  const prompt = `
    Analyze this image of an open fridge (or food items).
    1. Identify the visible ingredients (return in Simplified Chinese).
    2. Suggest 4-6 diverse recipes that can be made primarily with these ingredients. 
    ${dietaryText}
    3. For each recipe, provide:
       - A catchy title (in Simplified Chinese)
       - A short description (in Simplified Chinese)
       - Difficulty (Easy, Medium, Hard) - Keep as English Enum Value
       - Estimated prep time (e.g. "30分钟") (in Simplified Chinese)
       - Approximate calories per serving
       - A list of tags (e.g. 素食, 生酮, 高蛋白) (in Simplified Chinese)
       - Ingredients from the image used (in Simplified Chinese)
       - Missing ingredients needed to buy (in Simplified Chinese)
       - Step-by-step cooking instructions (array of strings in Simplified Chinese)
    
    Return the result strictly as JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedIngredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of ingredients identified in the image"
            },
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                  prepTime: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  usedIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "title", "difficulty", "prepTime", "calories", "steps", "missingIngredients"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Error analyzing fridge:", error);
    throw error;
  }
};