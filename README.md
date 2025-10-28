# DietAI

DietAI is a Next.js App Router project that streams AI-generated recipes using OpenRouter and the Vercel AI SDK. The UI is built with Tailwind CSS and shadcn/ui, with Prisma + Cloudflare D1 planned for persistence.

## Getting started

- Install dependencies: `pnpm install`
- Start the dev server: `pnpm dev`
- Run lint checks: `pnpm lint`

Environment variables live in `.env`; copy `.env.example` when you add it.

## Cloudflare Workers readiness

We still serve `/api/chat` from Next.js, but the repo already includes:

- `pnpm cf:dev` – runs `wrangler dev --local workers/chat.ts` once you add the Worker entry.
- `pnpm cf:deploy` – deploys to Workers when production bindings are ready.
- `src/config/ai.ts` – single source of truth for model IDs and URLs; mirror these as Worker `vars`/`secrets` later.

### Next steps before deploying to Cloudflare

1. Create `wrangler.toml` with worker name, `compatibility_date`, `vars`, and D1 binding skeletons.
2. Add `workers/chat.ts` exporting `fetch(request, env)`; reuse the logic from `src/app/api/chat/route.ts` but return `result.toDataStreamResponse()`.
3. Bind secrets with `wrangler secret put OPENROUTER_API_KEY` and update any client config to call the Worker URL.
