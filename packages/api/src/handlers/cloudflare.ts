import { handleRequest } from "../services/request-handler";
import { ChatMessage } from "../types";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const body = (await request.json()) as { messages: ChatMessage[] };

      const result = await handleRequest({
        method: request.method,
        path: url.pathname,
        body,
      });

      return new Response(JSON.stringify(result), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
};
