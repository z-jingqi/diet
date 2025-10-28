import { handleChatRequest } from "./handler";

export const runtime = "edge";

export async function POST(request: Request) {
  const response = await handleChatRequest(request);
  return response;
}
