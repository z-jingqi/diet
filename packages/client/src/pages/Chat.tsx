import { useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import TypingPrompt from "@/components/chat/TypingPrompt";
import ChatLayout from "@/components/chat/ChatLayout";
import useChatStore from "@/store/chat";
import useTagsStore from "@/store/tags";

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

  return (
    <div className="h-[100dvh]">
      <ChatLayout
        title="新对话"
        onRename={handleRename}
        onClearChat={handleClearChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChatItem={handleDeleteChatItem}
      >
        <div className="flex flex-col h-full">
          {/* 主要内容区域 */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {showTyping && messages.length === 0 ? (
              <TypingPrompt />
            ) : (
              <ChatMessages />
            )}
          </div>

          {/* 输入框区域 - 固定在底部 */}
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
