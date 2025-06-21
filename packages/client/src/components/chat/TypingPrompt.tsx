import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TypingPrompt = () => {
  const prompts = [
    "帮我制定一周的饮食计划",
    "这个食材有什么营养价值？",
    "如何搭配营养均衡的午餐？",
  ];

  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const isTypingRef = useRef(true);
  const promptsRef = useRef(prompts);

  // 更新prompts引用
  useEffect(() => {
    promptsRef.current = prompts;
  }, [prompts]);

  // 打字效果
  useEffect(() => {
    const startTyping = () => {
      // 清理之前的timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }

      const currentPromptText = promptsRef.current[currentPrompt];
      currentIndexRef.current = 0;
      setDisplayText("");
      isTypingRef.current = true;
      setIsTyping(true);

      const typeText = () => {
        if (!isTypingRef.current) return;
        
        if (currentIndexRef.current < currentPromptText.length) {
          setDisplayText(currentPromptText.slice(0, currentIndexRef.current + 1));
          currentIndexRef.current++;
          timerRef.current = setTimeout(typeText, 100);
        } else {
          setIsTyping(false);
          isTypingRef.current = false;
          // 暂停2秒后切换到下一个prompt
          pauseTimerRef.current = setTimeout(() => {
            setCurrentPrompt((prev) => (prev + 1) % promptsRef.current.length);
          }, 2000);
        }
      };

      typeText();
    };

    startTyping();

    // 清理函数
    return () => {
      isTypingRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [currentPrompt]); // 只依赖currentPrompt

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-lg font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[2rem] flex items-center"
    >
      <span>{displayText}</span>
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1 h-6 bg-current ml-1"
        />
      )}
    </motion.div>
  );
};

export default TypingPrompt;
