import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">
        烹饪步骤
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                {(step.order ?? index) + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed mb-1">
                  {step.instruction ?? step.description}
                </p>
                {step.durationApproxMin && (
                  <span className="text-xs text-muted-foreground">
                    预计 {step.durationApproxMin} 分钟
                  </span>
                )}
              </div>
            </li>
          ))}
          {steps.length === 0 && (
            <div className="text-center text-muted-foreground py-4 text-sm">
              暂无步骤信息
            </div>
          )}
        </ol>
      )}
    </div>
  );
};

export default RecipeSteps;
