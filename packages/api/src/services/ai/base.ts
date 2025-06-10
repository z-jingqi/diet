import { ChatMessage, ChatResponse } from "../../types";

export interface AnalysisResult {
  safe: boolean;
  recommendations: string[];
  warnings: string[];
}

export interface AIService {
  chat(messages: ChatMessage[]): Promise<ChatResponse>;
}
