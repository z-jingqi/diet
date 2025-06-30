import { Markdown } from "@/components/ui/markdown";

/**
 * 用户消息气泡
 */
const UserMessageBubble = ({ content }: { content: string | null | undefined }) => (
  <div className="flex w-full justify-end">
    <div className="max-w-[80%] bg-[#e9e9e9]/80 rounded-lg p-2">
      <Markdown content={content || ""} className="max-w-none" />
    </div>
  </div>
);

export default UserMessageBubble; 
