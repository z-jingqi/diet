import { Markdown } from "@/components/ui/markdown";

interface RecipeTipsProps {
  tips?: string | null;
}

const RecipeTips = ({ tips }: RecipeTipsProps) => {
  if (!tips) return null;
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">
        小贴士
      </h3>
      <div className="text-sm text-muted-foreground leading-relaxed">
        <Markdown content={tips} className="prose-sm" />
      </div>
    </div>
  );
};

export default RecipeTips;
