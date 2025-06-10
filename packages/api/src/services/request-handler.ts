import { DashScopeService } from './ai/dashscope';
import { ChatMessage } from '../types';

interface Request {
  method: string;
  path: string;
  body: {
    messages: ChatMessage[];
  };
}

interface Response {
  message?: ChatMessage;
  error?: string;
}

const aiService = new DashScopeService();

export async function handleRequest(request: Request): Promise<Response> {
  try {
    const { method, path, body } = request;
    
    if (path === '/api/chat' && method === 'POST') {
      const { messages } = body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return { error: 'Messages array is required' };
      }
      const response = await aiService.chat(messages);
      return { message: response };
    }
    
    return { error: 'Not Found' };
  } catch (error) {
    console.error('Error handling request:', error);
    return { error: 'Internal Server Error' };
  }
} 
