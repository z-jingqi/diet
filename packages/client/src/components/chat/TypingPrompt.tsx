import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingPromptProps {
  prompts: string[];
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

const TypingPrompt = ({
  prompts,
  onStartTyping,
  onStopTyping,
}: TypingPromptProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const currentPromptText = prompts[currentPrompt];

    const typeText = () => {
      if (currentIndex < currentPromptText.length) {
        setDisplayText(currentPromptText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, 100);
      } else {
        setIsTyping(false);
        onStopTyping?.();
        setTimeout(() => {
          setCurrentPrompt((prev) => (prev + 1) % prompts.length);
          setDisplayText("");
          setIsTyping(true);
          onStartTyping?.();
        }, 2000);
      }
    };

    if (isTyping) {
      onStartTyping?.();
      typeText();
    }
  }, [
    currentPrompt,
    isTyping,
    prompts,
    onStartTyping,
    onStopTyping,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[2rem]"
    >
      {displayText}
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
