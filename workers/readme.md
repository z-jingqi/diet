# Cloudflare Workers Scaffold

- `workers/chat.ts` reuses the shared `handleChatRequest` helper.
- Update the import path if you relocate handlers.
- Switch `preferWorkerStream` to `true` once you rely on `toDataStreamResponse()`.
