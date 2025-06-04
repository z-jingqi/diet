import type { AIRequest, AIResponse } from './types';

const API_ENDPOINT = process.env.VITE_API_ENDPOINT || 'https://your-function-url.fc.aliyuncs.com/2016-08-15/proxy/diet-ai-api/diet-ai-function/';

export async function callAI(request: AIRequest): Promise<AIResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        model: request.model,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content,
      raw: data,
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      success: false,
      content: '抱歉，AI 服务暂时不可用，请稍后再试。',
    };
  }
} 
