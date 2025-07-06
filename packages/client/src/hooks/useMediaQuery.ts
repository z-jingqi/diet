import { useState, useEffect } from "react";

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // 设置初始值
    setMatches(media.matches);

    // 创建事件监听器
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加事件监听器
    media.addEventListener("change", listener);

    // 清理函数
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
