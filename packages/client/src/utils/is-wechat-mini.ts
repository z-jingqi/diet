export const isWeChatMiniProgram = (): boolean => {
  if (typeof window === "undefined") return false;
  // WeChat JS SDK injects this variable when running in mini program WebView
  // @ts-ignore
  if (window.__wxjs_environment === "miniprogram") {
    return true;
  }

  const ua = navigator.userAgent || "";
  return /miniProgram/i.test(ua);
}; 
