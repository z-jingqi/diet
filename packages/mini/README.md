# Diet Mini Program Wrapper

This WeChat Mini-Program wraps the existing `@/client` web application in a WebView so you can distribute it through WeChat.

## Features

1. Calls `wx.login` on start-up to obtain a temporary login `code`.
2. Opens a `<web-view>` that loads the web client.
3. Passes the `code` as a query parameter so the web backend can exchange it for a token.
4. Automatically switches WebView URL based on the runtime environment:
   * **develop / trial** → `http://localhost:5173`
   * **release** → `https://your-domain.com`

## Development

1. Install dev dependencies:

```bash
pnpm i -F @diet/mp
```

2. Open the **WeChat Developer Tools** and choose "Open Mini Program", selecting the `packages/mini` folder.
3. Ensure the *Do not verify valid domain names, TLS certificates, and webview (request)`* checkbox is disabled when running locally.
4. Start the web client dev server:

```bash
pnpm --filter @diet/client dev
```

5. Reload the mini-program – it will display the web client inside a WebView.

## Production

When you build & upload the mini-program in **release** mode, the WebView will automatically point to `https://your-domain.com`.

Update the domain once you have the real production URL. 
