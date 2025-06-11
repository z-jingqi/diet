import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
// import { AIServiceFactory } from './services/ai/factory';
// import { AIProvider } from './services/ai/types';
import { MockAIService } from './services/ai/mock';

const app = express();
app.use(cors());
app.use(express.json());

// 健康检查接口
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 聊天接口
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    // const { messages, provider = 'qwen' } = req.body;
    const { prompt } = req.body;
    
    // const aiService = AIServiceFactory.create({
    //   type: provider as AIProvider,
    //   apiKey: process.env[`${provider.toUpperCase()}_API_KEY`] || '',
    //   apiSecret: process.env[`${provider.toUpperCase()}_API_SECRET`],
    //   defaultResponseFormat: 'json'
    // });
    const aiService = new MockAIService();
    const response = await aiService.chat(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// 阿里云函数计算入口
// export const handler = (req: Request, resp: Response) => {
//   app(req, resp);
// };

// 本地开发服务器
// if (process.env.NODE_ENV !== 'production') {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }
const port = 3000;
app.listen(port, () => {
  console.log(
    `%c🚀 Server is running on port ${port}`,
    'color: #00ff00; font-size: 16px; font-weight: bold; background: #1a1a1a; padding: 5px 10px; border-radius: 4px;'
  );
}); 
