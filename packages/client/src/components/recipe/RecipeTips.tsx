import { Typography } from "@/components/ui/typography";
import { Markdown } from "@/components/ui/markdown";

interface RecipeTipsProps {
  tips?: string | null;
}

const RecipeTips = ({ tips }: RecipeTipsProps) => {
  if (!tips) return null;
  return (
    <div className="mb-8">
      <Typography variant="h3" className="text-xl font-semibold mb-4">
        小贴士
      </Typography>
      <div className="bg-muted/30 rounded-lg p-4">
        <Markdown content={tips} />
      </div>
    </div>
  );
};

export default RecipeTips; 