import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./styles/page-transitions.css";
import App from "./App.tsx";
import { ConfirmDialogProvider } from "@/components/providers/ConfirmDialogProvider.tsx";

// 防止移动端输入框聚焦时页面缩放
const preventZoomOnFocus = () => {
  // 检测是否为移动设备
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768; // 添加屏幕宽度检测

  if (isMobile) {
    // 监听所有输入框和文本域的聚焦事件
    document.addEventListener("focusin", (e) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        // 确保字体大小至少为16px
        if (parseInt(window.getComputedStyle(target).fontSize) < 16) {
          target.style.fontSize = "16px";
        }
        // 添加硬件加速
        target.style.transform = "translateZ(0)";
      }
    });
  }
};

// 在DOM加载完成后执行
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preventZoomOnFocus);
} else {
  preventZoomOnFocus();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>
        <App />
      </ConfirmDialogProvider>
    </QueryClientProvider>
  </StrictMode>,
);
