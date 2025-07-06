import type { Plugin } from "graphql-yoga";

export const setCookiePlugin: Plugin = {
  onExecute() {
    return {
      onExecuteDone({ contextValue, result }: any) {
        if (
          contextValue.responseCookies &&
          contextValue.responseCookies.length
        ) {
          (result as any).headers ||= new Headers();
          contextValue.responseCookies.forEach((c: string) => {
            (result as any).headers.append("Set-Cookie", c);
          });
        }
      },
    };
  },
};
