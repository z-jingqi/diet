import { X, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@diet/shared";

interface SelectedTagsDisplayProps {
  selectedTags: Tag[];
  disabled?: boolean;
  onRemoveTag: (tagId: string) => void;
}

const SelectedTagsDisplay = ({
  selectedTags,
  disabled,
  onRemoveTag,
}: SelectedTagsDisplayProps) => {
  if (selectedTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          <TagIcon className="w-3 h-3" />
          {tag.name}
          <button
            disabled={disabled}
            onClick={() => onRemoveTag(tag.id)}
            className={`ml-1 transition-colors ${disabled ? '' : 'hover:text-red-500'}`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};

export default SelectedTagsDisplay; 
