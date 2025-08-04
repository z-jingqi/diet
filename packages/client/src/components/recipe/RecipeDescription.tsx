import { Markdown } from "@/components/ui/markdown";

interface RecipeDescriptionProps {
  description?: string | null;
  isLoading?: boolean;
}

const RecipeDescription = ({ description, isLoading }: RecipeDescriptionProps) => {
  if (isLoading || !description) {
    return null;
  }

  return (
    <div className="mb-6">
      <Markdown
        content={description}
        className="text-sm text-muted-foreground leading-relaxed prose-sm max-w-none"
      />
    </div>
  );
};

export default RecipeDescription;