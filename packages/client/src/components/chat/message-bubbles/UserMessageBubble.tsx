/**
 * 用户消息气泡
 */
const UserMessageBubble = ({ content }: { content: string }) => (
  <div className="flex w-full justify-end">
    <div className="max-w-[80%] bg-[#e9e9e9]/80 rounded-lg">
      <p className="text-gray-900 p-2">{content}</p>
    </div>
  </div>
);

export default UserMessageBubble; 