import { Markdown } from "@/components/ui/markdown";
import type { Message } from "@/types/chat";

/**
 * 食物可食性查询消息气泡
 */
const FoodAvailabilityMessageBubble = ({ 
  content, 
  foodAvailability 
}: { 
  content: string; 
  foodAvailability: Message['foodAvailability'];
}) => (
  <div className="flex w-full justify-start">
    <div className="max-w-[80%]">
      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            foodAvailability?.result.availability === '可吃' 
              ? 'bg-green-100 text-green-800'
              : foodAvailability?.result.availability === '不可吃'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {foodAvailability?.result.availability}
          </span>
          <span className="text-sm text-gray-500">
            {foodAvailability?.query}
          </span>
        </div>
        <Markdown 
          content={content} 
          className="prose dark:prose-invert max-w-none" 
        />
      </div>
    </div>
  </div>
);

export default FoodAvailabilityMessageBubble; 