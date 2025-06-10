export type APIPlatform = 'aliyun' | 'cloudflare';

interface APIConfig {
  baseURL: string;
  platform: APIPlatform;
}

const config: Record<string, APIConfig> = {
  development: {
    baseURL: 'http://localhost:3000',
    platform: 'aliyun'
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-aliyun-function-url',
    platform: (import.meta.env.VITE_API_PLATFORM as APIPlatform) || 'aliyun'
  }
};

export const apiConfig = config[import.meta.env.MODE]; 
