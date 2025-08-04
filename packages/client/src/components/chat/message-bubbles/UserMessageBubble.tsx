import { Markdown } from "@/components/ui/markdown";

/**
 * 用户消息气泡
 */
const UserMessageBubble = ({
  content,
}: {
  content: string | null | undefined;
}) => (
  <div className="flex w-full justify-end mb-4">
    <div className="bg-muted/40 rounded-lg px-3 py-2 max-w-[80%]">
      <Markdown content={content || ""} className="max-w-none prose-sm" />
    </div>
  </div>
);

export default UserMessageBubble;
