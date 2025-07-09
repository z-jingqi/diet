import { useEffect, useState } from "react";
import { isWeChatMiniProgram } from "@/utils/is-wechat";
import { useAuth } from "@/contexts/AuthContext";
import { createAuthenticatedClient } from "@/lib/gql/client";
import {
  useWechatLoginMutation,
  type WechatLoginMutationVariables,
} from "@/lib/gql/graphql";

// 返回是否正在自动登录、以及是否已尝试
const useWeChatAutoLogin = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isWeChatMiniProgram()) {
      return;
    }

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code || isAuthenticated || attempted) {
      return;
    }

    const doLogin = async () => {
      setLoading(true);
      setError(null);
      try {
        const client = createAuthenticatedClient();
        const variables: WechatLoginMutationVariables = { code }; // code is required
        await useWechatLoginMutation.fetcher(client, variables)();
        // Cookies should now be set by the server (issueLoginResponse). Fetch user again
        await checkAuth();
      } catch (err) {
        console.error("微信自动登录失败", err);
        setError(err as Error);
      } finally {
        // Remove ?code=xxx from URL to avoid repeated login on refresh
        url.searchParams.delete("code");
        window.history.replaceState({}, "", url.pathname + url.search);
        setLoading(false);
        setAttempted(true);
      }
    };

    void doLogin();
  }, [isAuthenticated, checkAuth, attempted]);

  const retryLogin = () => {
    setAttempted(false);
  };

  return { wechatAutoLoginLoading: loading, wechatAutoLoginError: error, retryWechatLogin: retryLogin };
};

export default useWeChatAutoLogin; 
