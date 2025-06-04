export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  success: boolean;
  content: string;
  raw?: unknown;
}

export interface AIRecipeRequest extends AIRequest {
  ingredients: string[];
  restrictions?: string[];
  preferences?: string[];
}

export interface AIRecipeResponse {
  recipe: {
    name: string;
    ingredients: Array<{
      name: string;
      amount: string;
    }>;
    steps: string[];
    nutrition: {
      protein: number;
      potassium: number;
      phosphorus: number;
      sodium: number;
      calories: number;
    };
    dietNote: string;
    tags: string[];
  };
  alternatives: {
    ingredients: string[];
    cookingMethods: string[];
  };
  nutritionAnalysis: {
    strengths: string[];
    warnings: string[];
  };
}

export interface AIFoodAnalysisRequest extends AIRequest {
  foods: string[];
}

export interface AIFoodAnalysisResponse {
  foods: Array<{
    name: string;
    allowed: 'yes' | 'no' | 'limited';
    reasons: string[];
    alternatives: string[];
  }>;
  overallAssessment: string;
  recommendations: string[];
} 
