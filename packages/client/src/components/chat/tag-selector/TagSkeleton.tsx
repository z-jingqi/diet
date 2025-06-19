import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const TagSkeleton = () => {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      </div>
    </Card>
  );
};

const TagListSkeleton = () => {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <TagSkeleton key={index} />
      ))}
    </div>
  );
};

export { TagSkeleton, TagListSkeleton }; 
