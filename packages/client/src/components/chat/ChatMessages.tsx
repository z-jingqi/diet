import MessageBubble from "./message-bubbles/MessageBubble";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage, MessageStatus } from "@/lib/gql/graphql";

interface ChatMessagesProps {
  messages: ChatMessage[];
  gettingIntent?: boolean;
}

const ChatMessages = ({
  messages,
  gettingIntent = false,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageIdRef = useRef<string>("");
  const lastMessageLengthRef = useRef<number>(0);
  const lastContentLengthRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

  // 处理滚动事件
  const handleScroll = () => {
    if (!containerRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // 如果用户向上滚动超过 100px，禁用自动滚动
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    // 如果用户手动滚动，标记为用户滚动状态
    if (!isNearBottom && shouldAutoScroll) {
      isUserScrollingRef.current = true;
    }

    setShouldAutoScroll(isNearBottom);
  };

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (!messagesEndRef.current || !shouldAutoScroll) {
      return;
    }
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [shouldAutoScroll]);

  // 监听消息变化
  useEffect(() => {
    const currentMessageCount = messages.length;
    const lastMessage = messages[currentMessageCount - 1];

    // 检查是否有新消息（消息数量增加）
    const hasNewMessage = currentMessageCount > lastMessageLengthRef.current;

    // 检查是否是新的消息ID（新消息开始）
    const isNewMessageId =
      lastMessage && lastMessage.id !== lastMessageIdRef.current;

    // 检查最后一条消息的内容是否更新（流式响应）
    const hasContentUpdate =
      lastMessage &&
      lastMessage.content &&
      lastMessage.content.length > lastContentLengthRef.current;

    // 检查是否有消息正在流式传输
    const hasStreamingMessage = messages.some(
      (msg) => msg.status === MessageStatus.Streaming
    );

    if (
      hasNewMessage ||
      isNewMessageId ||
      hasContentUpdate ||
      hasStreamingMessage
    ) {
      // 新消息开始时，重置用户滚动状态并启用自动滚动
      if (isNewMessageId) {
        isUserScrollingRef.current = false;
        setShouldAutoScroll(true);
      }

      // 更新引用
      lastMessageLengthRef.current = currentMessageCount;
      if (lastMessage) {
        lastMessageIdRef.current = lastMessage.id || "";
        lastContentLengthRef.current = lastMessage.content?.length || 0;
      }

      // 流式响应时，总是滚动到底部
      if (hasStreamingMessage) {
        isUserScrollingRef.current = false;
        setShouldAutoScroll(true);
      }
    }

    // 只有在用户没有主动滚动时才自动滚动
    if (!isUserScrollingRef.current || hasStreamingMessage) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto scrollbar-hide"
      onScroll={handleScroll}
    >
      <div className="py-6 space-y-6 max-w-3xl mx-auto w-full px-4">
        {messages.map((message) => {
          return <MessageBubble key={message.id} message={message} />;
        })}

        {/* Getting Intent 状态显示 */}
        {gettingIntent && (
          <div className="flex w-full justify-start">
            <div className="max-w-[80%]">
              <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                <div className="relative">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-gray-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll anchor at the bottom */}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default ChatMessages;
