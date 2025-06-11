import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
// import { AIServiceFactory } from './services/ai/factory';
// import { AIProvider } from './services/ai/types';
import { MockAIService } from "./services/ai/mock";

const app = express();
app.use(cors());
app.use(express.json());

// 健康检查接口
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 获取用户意图接口
app.post("/api/intent", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter" });
    }

    const aiService = new MockAIService();
    const intent = await aiService.getIntent(prompt);

    res.json({ intent });
  } catch (error) {
    console.error("Intent detection error:", error);
    res.status(500).json({ error: "Failed to detect intent" });
  }
});

// 聊天接口
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const aiService = new MockAIService();
    const stream = await aiService.chat(prompt);

    // 发送流式响应
    for await (const chunk of stream) {
      res.write(`data: ${chunk}\n\n`);
    }

    // 结束响应
    res.end();
  } catch (error) {
    console.error("Chat error:", error);
    // 发送错误事件
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: "Failed to process chat request" })}\n\n`
    );
    res.end();
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
  console.log(`🚀 Server is running on port ${port}`);
});
