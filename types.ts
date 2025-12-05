export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  tags: string[]; // e.g., 'Vegetarian', 'Keto', 'Gluten-Free'
  usedIngredients: string[];
  missingIngredients: string[];
  steps: string[];
}

export interface GeminiResponse {
  identifiedIngredients: string[];
  recipes: Recipe[];
}

export type ViewState = 'upload' | 'dashboard' | 'cooking' | 'shopping';

export interface FilterState {
  dietary: string[];
}

export const DIETARY_OPTIONS = ['素食', '纯素食', '生酮', '原始饮食', '无麸质', '低碳水'];