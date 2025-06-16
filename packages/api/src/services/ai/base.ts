import { AIService, Message, AIConfig, ResponseFormat } from './types';

export interface ServiceEnv {
  [key: string]: string | undefined;
}

export abstract class BaseAIService implements AIService {
  protected apiKey: string;
  protected baseUrl: string = '';
  protected model: string;
  protected defaultFormat: ResponseFormat = 'event-stream';

  constructor(config?: AIConfig, env?: ServiceEnv) {
    this.apiKey = config?.apiKey || '';
    this.model = config?.model || '';
    this.defaultFormat = config?.defaultResponseFormat || 'event-stream';
  }

  protected async makeRequest(
    url: string, 
    body: any, 
    format: ResponseFormat = 'json',
    headers: Record<string, string> = {}
  ): Promise<string | ReadableStream> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': format === 'event-stream' ? 'text/event-stream' : 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    if (format === 'event-stream') {
      return response.body as ReadableStream;
    }

    const data = await response.json();
    return this.parseResponse(data);
  }

  protected abstract parseResponse(data: any): string;

  abstract chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream>;
  abstract getIntent(messages: Message[]): Promise<string>;
} 