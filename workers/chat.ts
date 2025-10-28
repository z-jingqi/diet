async function fetchHandler() {
  return Response.json(
    {
      error:
        "Worker streaming is not yet implemented. Use the Next.js /api/chat route until Cloudflare deployment.",
    },
    { status: 501 }
  );
}

const worker = { fetch: fetchHandler };

export default worker;
