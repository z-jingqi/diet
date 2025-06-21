import { useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import useChatStore from "@/store/chat";
import useTagsStore from "@/store/tags";

const prompts = [
  "今天想吃什么？",
  "有什么饮食禁忌吗？",
  "想了解什么食材？",
  "需要营养建议吗？",
];

const ChatPage = () => {
  const {
    messages,
    sendMessage,
    resetMessages,
    canSendMessage,
    abortCurrentMessage,
  } = useChatStore();

  const { clearTags, selectedTags } = useTagsStore();

  const [showTyping, setShowTyping] = useState(true);
  const [, setIsTyping] = useState(true);

  const handleSendMessage = async (content: string) => {
    setShowTyping(false);
    await sendMessage(content, selectedTags);
  };

  const handleReset = () => {
    resetMessages();
    clearTags();
    setShowTyping(true);
  };

  // 判断是否可终止
  const canAbort =
    messages.length > 0 &&
    (() => {
      const last = messages[messages.length - 1];
      return (
        !last.isUser &&
        (last.status === "pending" || last.status === "streaming")
      );
    })();

  // 处理header操作
  const handleRename = () => {
    // TODO: 实现重命名功能
    console.log("重命名对话");
  };

  const handleClearChat = () => {
    handleReset();
  };

  const handleDeleteChat = () => {
    // TODO: 实现删除对话功能
    console.log("删除对话");
  };

  const handleNewChat = () => {
    handleReset();
  };

  const handleSelectChat = (chatId: string) => {
    // TODO: 实现选择对话功能
    console.log("选择对话:", chatId);
  };

  const handleRenameChat = (chatId: string) => {
    // TODO: 实现重命名对话功能
    console.log("重命名对话:", chatId);
  };

  const handleDeleteChatItem = (chatId: string) => {
    // TODO: 实现删除对话项功能
    console.log("删除对话项:", chatId);
  };

  const handleUserClick = () => {
    // TODO: 实现用户点击功能
    console.log("用户点击");
  };

  return (
    <div className="h-full">
      <ChatLayout
        title="新对话"
        onRename={handleRename}
        onClearChat={handleClearChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChatItem={handleDeleteChatItem}
        onUserClick={handleUserClick}
      >
        <div className="flex flex-col h-full items-center justify-center">
          {/* 主要内容区域 */}
          {showTyping ? (
            <TypingPrompt
              prompts={prompts}
              onStartTyping={() => setIsTyping(true)}
              onStopTyping={() => setIsTyping(false)}
            />
          ) : (
            <ChatMessages />
          )}

          {/* 输入框区域 - 始终在底部 */}
          <div className="w-full max-w-3xl mx-auto p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!canSendMessage()}
              canAbort={canAbort}
              onAbort={abortCurrentMessage}
            />
          </div>
        </div>
      </ChatLayout>
    </div>
  );
};

export default ChatPage;
