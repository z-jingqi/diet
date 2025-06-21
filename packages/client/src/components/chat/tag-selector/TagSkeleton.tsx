import { Skeleton } from "@/components/ui/skeleton";

const TagSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* 模拟3个分类 */}
      {[1, 2, 3].map((categoryIndex) => (
        <div key={categoryIndex} className="space-y-2">
          {/* 分类标题骨架 */}
          <Skeleton className="h-4 w-20" />
          
          {/* 标签骨架 */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((tagIndex) => (
              <Skeleton key={tagIndex} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagSkeleton; 