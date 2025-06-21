import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import type { Tag, TagCategory } from "@diet/shared";

interface TagListProps {
  categories: TagCategory[];
  tagsData?: {
    tags: Tag[];
    categories: TagCategory[];
  };
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
}

const TagList = ({
  categories,
  tagsData,
  selectedTags,
  onTagToggle,
}: TagListProps) => {
  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="mb-6 flex flex-col gap-1">
          <Typography variant="span" className="mb-2 text-sm">{category.name}</Typography>
          <div className="flex flex-wrap gap-2">
            {tagsData?.tags
              .filter((tag) => tag.categoryId === category.id)
              .map((tag) => {
                const isSelected = selectedTags.some((t) => t.id === tag.id);
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors px-4 py-2 text-sm ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => onTagToggle(tag)}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
};

export default TagList; 