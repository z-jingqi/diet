import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";

interface Step {
  instruction?: string;
  description?: string;
  durationApproxMin?: number;
  order?: number;
}

interface RecipeStepsProps {
  isLoading: boolean;
  steps: Step[];
}

const RecipeSteps = ({ isLoading, steps }: RecipeStepsProps) => {
  return (
    <div className="mb-8">
      <Typography variant="h3" className="text-xl font-semibold mb-4">
        烹饪步骤
      </Typography>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                {(step.order ?? index) + 1}
              </div>
              <div className="flex-1">
                <Typography variant="p" className="mb-1">
                  {step.instruction ?? step.description}
                </Typography>
                {step.durationApproxMin && (
                  <Typography
                    variant="span"
                    className="text-xs text-muted-foreground"
                  >
                    预计 {step.durationApproxMin} 分钟
                  </Typography>
                )}
              </div>
            </li>
          ))}
          {steps.length === 0 && (
            <li className="text-center text-muted-foreground py-2">
              暂无步骤信息
            </li>
          )}
        </ol>
      )}
    </div>
  );
};

export default RecipeSteps;
